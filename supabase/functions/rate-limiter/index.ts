import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowMinutes: number;
  blockDurationMinutes?: number;
}

// Production-ready rate limiting configuration
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'api_general': { endpoint: 'general', maxRequests: 1000, windowMinutes: 15 },
  'api_upload': { endpoint: 'upload', maxRequests: 50, windowMinutes: 15 },
  'api_auth': { endpoint: 'auth', maxRequests: 20, windowMinutes: 15, blockDurationMinutes: 60 },
  'api_search': { endpoint: 'search', maxRequests: 200, windowMinutes: 15 },
  'api_ai': { endpoint: 'ai', maxRequests: 100, windowMinutes: 60 }, // AI operations are expensive
  'api_export': { endpoint: 'export', maxRequests: 10, windowMinutes: 60 }
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
    
    // Get request data
    const { endpoint, userId, userAgent } = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Endpoint required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get rate limit configuration
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS['api_general'];
    const windowStart = new Date(Date.now() - (config.windowMinutes * 60 * 1000));
    
    // Check rate limit for user (if authenticated)
    let userRateLimit = null;
    if (userId) {
      const { data: userLimits, error: userError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('endpoint', config.endpoint)
        .gte('window_start', windowStart.toISOString())
        .order('window_start', { ascending: false })
        .limit(1);
        
      if (userError) {
        console.error('Error checking user rate limit:', userError);
      } else if (userLimits && userLimits.length > 0) {
        userRateLimit = userLimits[0];
      }
    }
    
    // Check rate limit for IP
    const { data: ipLimits, error: ipError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', clientIP)
      .eq('endpoint', config.endpoint)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1);
      
    if (ipError) {
      console.error('Error checking IP rate limit:', ipError);
    }
    
    const ipRateLimit = ipLimits && ipLimits.length > 0 ? ipLimits[0] : null;
    
    // Check if limits exceeded
    const userExceeded = userRateLimit && userRateLimit.request_count >= config.maxRequests;
    const ipExceeded = ipRateLimit && ipRateLimit.request_count >= config.maxRequests;
    
    if (userExceeded || ipExceeded) {
      // Log security event for rate limit exceeded
      await supabase
        .from('security_audit_logs')
        .insert([
          {
            user_id: userId,
            event_type: 'RATE_LIMIT_EXCEEDED',
            event_data: {
              endpoint: config.endpoint,
              user_count: userRateLimit?.request_count || 0,
              ip_count: ipRateLimit?.request_count || 0,
              max_requests: config.maxRequests,
              window_minutes: config.windowMinutes
            },
            ip_address: clientIP,
            user_agent: userAgent
          }
        ]);
      
      return new Response(JSON.stringify({
        allowed: false,
        rateLimited: true,
        retryAfter: config.windowMinutes * 60, // Seconds
        message: `Rate limit exceeded for ${config.endpoint}. Max ${config.maxRequests} requests per ${config.windowMinutes} minutes.`,
        resetTime: new Date(Date.now() + (config.windowMinutes * 60 * 1000)).toISOString()
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': (config.windowMinutes * 60).toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (Date.now() + (config.windowMinutes * 60 * 1000)).toString()
        },
      });
    }
    
    // Update or create rate limit record
    const currentWindow = new Date();
    currentWindow.setMinutes(Math.floor(currentWindow.getMinutes() / config.windowMinutes) * config.windowMinutes, 0, 0);
    
    // Update user rate limit
    if (userId) {
      if (userRateLimit && userRateLimit.window_start >= currentWindow.toISOString()) {
        // Update existing record
        await supabase
          .from('rate_limits')
          .update({ 
            request_count: userRateLimit.request_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', userRateLimit.id);
      } else {
        // Create new record
        await supabase
          .from('rate_limits')
          .insert([
            {
              user_id: userId,
              endpoint: config.endpoint,
              request_count: 1,
              window_start: currentWindow.toISOString()
            }
          ]);
      }
    }
    
    // Update IP rate limit
    if (ipRateLimit && ipRateLimit.window_start >= currentWindow.toISOString()) {
      // Update existing record
      await supabase
        .from('rate_limits')
        .update({ 
          request_count: ipRateLimit.request_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', ipRateLimit.id);
    } else {
      // Create new record
      await supabase
        .from('rate_limits')
        .insert([
          {
            ip_address: clientIP,
            endpoint: config.endpoint,
            request_count: 1,
            window_start: currentWindow.toISOString()
          }
        ]);
    }
    
    // Calculate remaining requests
    const userRemaining = config.maxRequests - ((userRateLimit?.request_count || 0) + 1);
    const ipRemaining = config.maxRequests - ((ipRateLimit?.request_count || 0) + 1);
    const remaining = Math.min(userRemaining, ipRemaining);
    
    return new Response(JSON.stringify({
      allowed: true,
      rateLimited: false,
      remaining: Math.max(0, remaining),
      resetTime: new Date(currentWindow.getTime() + (config.windowMinutes * 60 * 1000)).toISOString(),
      config: {
        endpoint: config.endpoint,
        maxRequests: config.maxRequests,
        windowMinutes: config.windowMinutes
      }
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, remaining).toString(),
        'X-RateLimit-Reset': (currentWindow.getTime() + (config.windowMinutes * 60 * 1000)).toString()
      },
    });
    
  } catch (error) {
    console.error('Rate limiter error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Rate limiting service error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});