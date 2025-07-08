import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface RateLimitConfig {
  action: string;
  maxRequests: number;
  windowMs: number;
  burstLimit?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number;
  retryAfter: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'ai_request': { action: 'ai_request', maxRequests: 100, windowMs: 3600000 }, // 100/hour
  'note_create': { action: 'note_create', maxRequests: 200, windowMs: 3600000 }, // 200/hour
  'note_update': { action: 'note_update', maxRequests: 500, windowMs: 3600000 }, // 500/hour
  'search': { action: 'search', maxRequests: 1000, windowMs: 3600000 }, // 1000/hour
  'export': { action: 'export', maxRequests: 10, windowMs: 3600000 }, // 10/hour
};

export const useAdvancedRateLimit = () => {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiry, setBlockExpiry] = useState<number | null>(null);

  const checkRateLimit = useCallback(async (
    action: string,
    context?: Record<string, any>
  ): Promise<RateLimitResult> => {
    try {
      if (!user) {
        return {
          allowed: false,
          remainingRequests: 0,
          resetTime: Date.now() + 3600000,
          retryAfter: 3600000
        };
      }

      // Since check_enhanced_rate_limit_v2 function doesn't exist, use local rate limiting
      console.warn('Advanced rate limiting not available - function missing');
      
      const config = DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS['ai_request'];
      const key = `rate_limit_${user.id}_${action}`;
      const now = Date.now();
      
      try {
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : { count: 0, resetTime: now + config.windowMs };
        
        // Reset if window expired
        if (now >= data.resetTime) {
          data.count = 0;
          data.resetTime = now + config.windowMs;
        }
        
        // Check if limit exceeded
        if (data.count >= config.maxRequests) {
          const retryAfter = data.resetTime - now;
          return {
            allowed: false,
            remainingRequests: 0,
            resetTime: data.resetTime,
            retryAfter
          };
        }
        
        // Increment count
        data.count++;
        localStorage.setItem(key, JSON.stringify(data));
        
        return {
          allowed: true,
          remainingRequests: config.maxRequests - data.count,
          resetTime: data.resetTime,
          retryAfter: 0
        };
      } catch (storageError) {
        console.warn('LocalStorage error, allowing request:', storageError);
        return {
          allowed: true,
          remainingRequests: 100,
          resetTime: Date.now() + 3600000,
          retryAfter: 0
        };
      }
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow action if rate limit check fails
      return {
        allowed: true,
        remainingRequests: 1,
        resetTime: Date.now() + 3600000,
        retryAfter: 0
      };
    }
  }, [user]);

  const getRateLimitStatus = useCallback(async (action: string) => {
    const result = await checkRateLimit(action);
    return {
      isBlocked: !result.allowed,
      remainingRequests: result.remainingRequests,
      resetTime: result.resetTime,
      retryAfter: result.retryAfter
    };
  }, [checkRateLimit]);

  const clearRateLimit = useCallback(async (action: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const key = `rate_limit_${user.id}_${action}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing rate limit:', error);
      return false;
    }
  }, [user]);

  // Check if currently blocked
  useEffect(() => {
    const checkBlockStatus = async () => {
      if (blockExpiry && Date.now() < blockExpiry) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
        setBlockExpiry(null);
      }
    };

    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [blockExpiry]);

  return {
    checkRateLimit,
    getRateLimitStatus,
    clearRateLimit,
    isBlocked,
    blockExpiry
  };
};