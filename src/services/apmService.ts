import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface APMMetric {
  metric_type: string;
  metric_name: string;
  metric_value: number;
  tags?: Record<string, any>;
  timestamp?: string;
}

export interface APMError {
  error_type: string;
  error_message: string;
  error_stack?: string;
  component_name?: string;
  user_agent?: string;
  url?: string;
  is_filtered?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  tags?: Record<string, any>;
}

export interface APMAlert {
  alert_type: string;
  title: string;
  description: string;
  threshold_value?: number;
  current_value?: number;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface APMSession {
  session_id: string;
  start_time?: string;
  end_time?: string;
  page_views?: number;
  total_errors?: number;
  avg_load_time?: number;
  bounce_rate?: number;
}

export interface APMEmailAlert {
  alertType: 'error' | 'performance';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  errorMessage?: string;
  errorStack?: string;
  componentName?: string;
  url?: string;
  userAgent?: string;
  metricValue?: number;
  thresholdValue?: number;
  userId: string;
  userEmail?: string;
}

// Known error patterns to track and suppress
export const KNOWN_ERROR_PATTERNS = {
  CACHE_PUT_ERROR: 'Failed to execute \'put\' on \'Cache\'',
  PARTIAL_RESPONSE: 'Partial response (status code 206) is unsupported',
  CSP_VIOLATION: 'Content Security Policy directive',
  WEBSOCKET_LOCALHOST: 'ws://localhost',
  RATE_LIMITING: '429',
  SENTRY_RATE_LIMIT: 'Too Many Requests',
};

class APMService {
  private static instance: APMService;
  private sessionId: string;
  private userId: string | null = null;
  private isEnabled: boolean = true;

  // Lovable development environment error patterns to filter
  private readonly DEV_ERROR_PATTERNS = [
    /lovable\.dev/i,
    /lovable\.app/i,
    /vite.*hmr/i,
    /hot.*reload/i,
    /webpack.*hmr/i,
    /dev.*server/i,
    /live.*reload/i,
    /@vite\/client/i,
    /socket.*disconnect/i,
    /react.*devtools/i,
    /react.*refresh/i,
    /__REACT_DEVTOOLS_GLOBAL_HOOK__/i,
    /fast.*refresh/i,
    /development.*mode/i,
    /dev.*environment/i
  ];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  static getInstance(): APMService {
    if (!APMService.instance) {
      APMService.instance = new APMService();
    }
    return APMService.instance;
  }

  private generateSessionId(): string {
    return `apm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  private async initializeSession() {
    if (!this.isEnabled || !this.userId) return;

    try {
      await supabase.from('apm_sessions').insert({
        user_id: this.userId,
        session_id: this.sessionId,
        start_time: new Date().toISOString(),
        page_views: 1,
        total_errors: 0
      });
    } catch (error) {
      logger.error('Failed to initialize APM session', { error });
    }
  }

  async recordMetric(metric: APMMetric) {
    if (!this.isEnabled || !this.userId) return;

    try {
      await supabase.from('apm_performance_metrics').insert({
        user_id: this.userId,
        ...metric,
        timestamp: metric.timestamp || new Date().toISOString()
      });

      // Check if metric exceeds thresholds and create alerts
      await this.checkMetricThresholds(metric);
    } catch (error) {
      logger.error('Failed to record APM metric', { error, metric });
    }
  }

  async recordError(error: APMError) {
    if (!this.isEnabled || !this.userId) return;

    // Filter out development environment errors
    const isFiltered = this.shouldFilterError(error);

    try {
      await supabase.from('apm_error_logs').insert({
        user_id: this.userId,
        ...error,
        is_filtered: isFiltered,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

      // Update session error count if not filtered
      if (!isFiltered) {
        await this.updateSessionErrorCount();
      }

      // Create alert for critical errors
      if (error.severity === 'critical' && !isFiltered) {
        await this.createAlert({
          alert_type: 'error',
          title: 'Critical Error Detected',
          description: `Critical error in ${error.component_name}: ${error.error_message}`,
          severity: 'critical'
        });

        // Send email notification for critical errors
        await this.sendEmailAlert({
          alertType: 'error',
          title: 'Critical Error Detected',
          description: `Critical error in ${error.component_name}: ${error.error_message}`,
          severity: 'critical',
          errorMessage: error.error_message,
          errorStack: error.error_stack,
          componentName: error.component_name,
          url: error.url || window.location.href,
          userAgent: error.user_agent || navigator.userAgent,
          userId: this.userId
        });
      }
    } catch (err) {
      logger.error('Failed to record APM error', { err, error });
    }
  }

  async createAlert(alert: APMAlert) {
    if (!this.isEnabled || !this.userId) return;

    try {
      await supabase.from('apm_alerts').insert({
        user_id: this.userId,
        ...alert
      });
    } catch (error) {
      logger.error('Failed to create APM alert', { error, alert });
    }
  }

  async updateSession(sessionData: Partial<APMSession>) {
    if (!this.isEnabled || !this.userId) return;

    try {
      await supabase
        .from('apm_sessions')
        .update(sessionData)
        .eq('session_id', this.sessionId)
        .eq('user_id', this.userId);
    } catch (error) {
      logger.error('Failed to update APM session', { error, sessionData });
    }
  }

  private shouldFilterError(error: APMError): boolean {
    const errorText = `${error.error_message} ${error.error_stack || ''}`;
    
    // Check against development patterns
    const isDevError = this.DEV_ERROR_PATTERNS.some(pattern => pattern.test(errorText));
    
    // Check against known error patterns (these should be tracked but filtered from console)
    const isKnownError = Object.values(KNOWN_ERROR_PATTERNS).some(pattern => 
      errorText.includes(pattern)
    );
    
    return isDevError || isKnownError;
  }

  // Track known infrastructure errors separately
  async recordKnownInfrastructureError(errorMessage: string, errorType: string) {
    if (!this.isEnabled || !this.userId) return;

    await this.recordError({
      error_type: `infrastructure_${errorType}`,
      error_message: errorMessage,
      severity: 'low',
      is_filtered: true,
      tags: { 
        error_category: 'infrastructure',
        error_pattern: errorType,
        suppressed_from_console: true 
      }
    });
  }

  private async updateSessionErrorCount() {
    if (!this.userId) return;

    try {
      const { data: session } = await supabase
        .from('apm_sessions')
        .select('total_errors')
        .eq('session_id', this.sessionId)
        .eq('user_id', this.userId)
        .single();

      if (session) {
        await supabase
          .from('apm_sessions')
          .update({ total_errors: (session.total_errors || 0) + 1 })
          .eq('session_id', this.sessionId)
          .eq('user_id', this.userId);
      }
    } catch (error) {
      logger.error('Failed to update session error count', { error });
    }
  }

  private async sendEmailAlert(alertData: APMEmailAlert) {
    if (!this.isEnabled || !this.userId) return;

    try {
      const { data, error } = await supabase.functions.invoke('send-apm-alert', {
        body: alertData
      });

      if (error) {
        logger.error('Failed to send APM email alert', { error, alertData });
      } else {
        logger.info('APM email alert sent successfully', { emailId: data?.emailId });
      }
    } catch (error) {
      logger.error('Failed to invoke send-apm-alert function', { error, alertData });
    }
  }

  private async checkMetricThresholds(metric: APMMetric) {
    // Define performance thresholds
    const thresholds = {
      'page_load_time': 3000, // 3 seconds
      'memory_usage': 100, // 100MB
      'error_rate': 5, // 5%
      'response_time': 1000 // 1 second
    };

    const threshold = thresholds[metric.metric_name as keyof typeof thresholds];
    if (threshold && metric.metric_value > threshold) {
      const severity = metric.metric_value > threshold * 1.5 ? 'critical' : 'warning';
      
      await this.createAlert({
        alert_type: 'performance',
        title: `High ${metric.metric_name}`,
        description: `${metric.metric_name} (${metric.metric_value}) exceeded threshold (${threshold})`,
        threshold_value: threshold,
        current_value: metric.metric_value,
        severity
      });

      // Send email for critical performance issues
      if (severity === 'critical') {
        await this.sendEmailAlert({
          alertType: 'performance',
          title: `Critical Performance Issue: High ${metric.metric_name}`,
          description: `${metric.metric_name} (${metric.metric_value}) severely exceeded threshold (${threshold})`,
          severity: 'critical',
          metricValue: metric.metric_value,
          thresholdValue: threshold,
          url: window.location.href,
          userId: this.userId
        });
      }
    }
  }

  // Public methods for recording common metrics
  async recordPageLoad(loadTime: number) {
    await this.recordMetric({
      metric_type: 'performance',
      metric_name: 'page_load_time',
      metric_value: loadTime,
      tags: { url: window.location.pathname }
    });
  }

  async recordUserAction(action: string, duration?: number) {
    await this.recordMetric({
      metric_type: 'user_interaction',
      metric_name: action,
      metric_value: duration || 1,
      tags: { url: window.location.pathname }
    });
  }

  async recordApiCall(endpoint: string, duration: number, status: number) {
    await this.recordMetric({
      metric_type: 'api',
      metric_name: 'api_call',
      metric_value: duration,
      tags: { endpoint, status, url: window.location.pathname }
    });
  }

  // Getter methods for dashboard
  async getMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    if (!this.userId) return [];

    const timeRanges = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const hoursAgo = timeRanges[timeRange];
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    const { data } = await supabase
      .from('apm_performance_metrics')
      .select('*')
      .eq('user_id', this.userId)
      .gte('timestamp', since)
      .order('timestamp', { ascending: false });

    return data || [];
  }

  async getErrors(timeRange: '1h' | '24h' | '7d' | '30d' = '24h', includeFiltered: boolean = false) {
    if (!this.userId) return [];

    const timeRanges = {
      '1h': 1,
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    };

    const hoursAgo = timeRanges[timeRange];
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    let query = supabase
      .from('apm_error_logs')
      .select('*')
      .eq('user_id', this.userId)
      .gte('timestamp', since);

    if (!includeFiltered) {
      query = query.eq('is_filtered', false);
    }

    const { data } = await query.order('timestamp', { ascending: false });
    return data || [];
  }

  async getAlerts(unacknowledgedOnly: boolean = false) {
    if (!this.userId) return [];

    let query = supabase
      .from('apm_alerts')
      .select('*')
      .eq('user_id', this.userId);

    if (unacknowledgedOnly) {
      query = query.eq('is_acknowledged', false);
    }

    const { data } = await query.order('created_at', { ascending: false });
    return data || [];
  }

  async acknowledgeAlert(alertId: string) {
    if (!this.userId) return;

    await supabase
      .from('apm_alerts')
      .update({ is_acknowledged: true })
      .eq('id', alertId)
      .eq('user_id', this.userId);
  }

  async resolveAlert(alertId: string) {
    if (!this.userId) return;

    await supabase
      .from('apm_alerts')
      .update({ is_resolved: true, is_acknowledged: true })
      .eq('id', alertId)
      .eq('user_id', this.userId);
  }
}

export const apmService = APMService.getInstance();