import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthMetrics {
  timestamp: string;
  cpuUsage?: number;
  memoryUsage?: number;
  activeConnections?: number;
  responseTime: number;
  uptime: number;
}

interface AlertThresholds {
  maxResponseTime: number;
  maxCpuUsage: number;
  maxMemoryUsage: number;
  maxActiveConnections: number;
}

const ALERT_THRESHOLDS: AlertThresholds = {
  maxResponseTime: 2000, // 2 seconds
  maxCpuUsage: 80, // 80%
  maxMemoryUsage: 85, // 85%
  maxActiveConnections: 100
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const startTime = Date.now();
    
    // Collect health metrics
    const metrics: HealthMetrics = {
      timestamp: new Date().toISOString(),
      responseTime: 0, // Will be calculated
      uptime: performance.now() / 1000, // Seconds since start
    };
    
    // Test database connectivity and get active connections
    const { data: connectionData, error: connectionError } = await supabase
      .from('app_metrics')
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.error('Database connectivity issue:', connectionError);
    }
    
    // Get system metrics from performance API if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
    }
    
    // Calculate response time
    metrics.responseTime = Date.now() - startTime;
    
    // Check for alerts based on thresholds
    const alerts = [];
    
    if (metrics.responseTime > ALERT_THRESHOLDS.maxResponseTime) {
      alerts.push({
        type: 'HIGH_RESPONSE_TIME',
        severity: 'warning',
        value: metrics.responseTime,
        threshold: ALERT_THRESHOLDS.maxResponseTime,
        message: `Response time ${metrics.responseTime}ms exceeds threshold of ${ALERT_THRESHOLDS.maxResponseTime}ms`
      });
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > ALERT_THRESHOLDS.maxMemoryUsage) {
      alerts.push({
        type: 'HIGH_MEMORY_USAGE',
        severity: 'critical',
        value: metrics.memoryUsage,
        threshold: ALERT_THRESHOLDS.maxMemoryUsage,
        message: `Memory usage ${metrics.memoryUsage}% exceeds threshold of ${ALERT_THRESHOLDS.maxMemoryUsage}%`
      });
    }
    
    // Store metrics in database
    const { error: metricsError } = await supabase
      .from('app_metrics')
      .insert([
        {
          metric_name: 'system_health',
          metric_value: metrics.responseTime,
          metric_type: 'gauge',
          tags: {
            type: 'health_check',
            memory_usage: metrics.memoryUsage,
            uptime: metrics.uptime
          }
        }
      ]);
      
    if (metricsError) {
      console.error('Failed to store metrics:', metricsError);
    }
    
    // Create alerts if any critical issues found
    for (const alert of alerts) {
      if (alert.severity === 'critical') {
        const { error: alertError } = await supabase
          .from('apm_alerts')
          .insert([
            {
              alert_type: alert.type,
              title: 'Critical System Alert',
              description: alert.message,
              severity: alert.severity,
              current_value: alert.value,
              threshold_value: alert.threshold
            }
          ]);
          
        if (alertError) {
          console.error('Failed to create alert:', alertError);
        }
      }
    }
    
    // Health status determination
    const isHealthy = alerts.filter(a => a.severity === 'critical').length === 0;
    
    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: metrics.timestamp,
      metrics,
      alerts,
      checks: {
        database: !connectionError,
        response_time: metrics.responseTime < ALERT_THRESHOLDS.maxResponseTime,
        memory: !metrics.memoryUsage || metrics.memoryUsage < ALERT_THRESHOLDS.maxMemoryUsage
      }
    };
    
    console.log('Health check completed:', {
      status: healthStatus.status,
      responseTime: metrics.responseTime,
      alertsCount: alerts.length
    });
    
    return new Response(JSON.stringify(healthStatus), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      status: isHealthy ? 200 : 503
    });
    
  } catch (error) {
    console.error('Health monitor error:', error);
    
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});