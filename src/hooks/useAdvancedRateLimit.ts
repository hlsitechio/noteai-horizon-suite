import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  endpoint: string;
}

interface RateLimitState {
  isAllowed: boolean;
  remaining: number;
  resetTime: number;
  blocked: boolean;
}

export const useAdvancedRateLimit = (config: RateLimitConfig) => {
  const { user } = useAuth();
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isAllowed: true,
    remaining: config.maxRequests,
    resetTime: Date.now() + config.windowMs,
    blocked: false,
  });

  const checkRateLimit = useCallback(async (action: string) => {
    if (!user) return false;

    try {
      // Check local rate limit first (client-side)
      const now = Date.now();
      if (now > rateLimitState.resetTime) {
        setRateLimitState({
          isAllowed: true,
          remaining: config.maxRequests,
          resetTime: now + config.windowMs,
          blocked: false,
        });
      }

      if (rateLimitState.remaining <= 0) {
        setRateLimitState(prev => ({ ...prev, blocked: true }));
        return false;
      }

      // Check server-side rate limit
      const { data, error } = await supabase.rpc('check_enhanced_rate_limit_v2', {
        user_uuid: user.id,
        action_type: action,
        max_requests: config.maxRequests,
        time_window: `${config.windowMs / 1000} seconds`,
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return false;
      }

      if (!data) {
        setRateLimitState(prev => ({
          ...prev,
          remaining: 0,
          blocked: true,
        }));
        return false;
      }

      // Update local state
      setRateLimitState(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - 1),
        isAllowed: data,
      }));

      return data;
    } catch (error) {
      console.error('Rate limit error:', error);
      return false;
    }
  }, [user, config, rateLimitState]);

  const reset = useCallback(() => {
    setRateLimitState({
      isAllowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
      blocked: false,
    });
  }, [config]);

  // Auto-reset when window expires
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      if (now > rateLimitState.resetTime) {
        reset();
      }
    }, rateLimitState.resetTime - Date.now());

    return () => clearTimeout(timer);
  }, [rateLimitState.resetTime, reset]);

  return {
    checkRateLimit,
    reset,
    ...rateLimitState,
  };
};