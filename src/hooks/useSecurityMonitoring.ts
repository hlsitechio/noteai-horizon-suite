import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import { auditLogService } from '@/services/security/auditLogService';
import { sessionSecurityService } from '@/services/security/sessionSecurityService';
import { rateLimitingService } from '@/services/security/rateLimitingService';

interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      // Enhanced audit logging with pattern analysis
      await auditLogService.logEvent({
        eventType: event.eventType,
        userId: user?.id,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent || navigator.userAgent,
        riskLevel: event.severity,
        metadata: event.details,
        result: event.details?.result || 'unknown',
      });

      // Session security validation
      if (user?.id && event.severity !== 'low') {
        const sessionValidation = sessionSecurityService.validateSession(user.id, {
          ipAddress: event.ipAddress,
          userAgent: event.userAgent || navigator.userAgent,
        });

        if (!sessionValidation.valid || sessionValidation.action === 'force_logout') {
          await sessionSecurityService.invalidateSession(user.id);
          window.location.href = '/auth';
          return;
        }

        if (sessionValidation.action === 'require_2fa') {
          // Could trigger 2FA requirement in the future
          console.warn('Session anomaly detected - consider implementing 2FA');
        }
      }

      // Console logging for development
      if (import.meta.env.DEV) {
        console.log(`[SECURITY] ${event.eventType}:`, event.details);
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  }, [user]);

  const detectSuspiciousActivity = useCallback((activityType: string, details: any) => {
    const suspiciousPatterns = {
      rapid_requests: details.requestCount > 100,
      unusual_time: new Date().getHours() < 5 || new Date().getHours() > 23,
      multiple_failures: details.failureCount > 5,
      invalid_input: details.invalidInputAttempts > 3,
      rate_limit_exceeded: !rateLimitingService.checkGlobalLimits(user?.id, details.ipAddress),
    };

    const detectedPatterns = Object.entries(suspiciousPatterns)
      .filter(([, detected]) => detected)
      .map(([pattern]) => pattern);

    if (detectedPatterns.length > 0) {
      // Report to session security service
      if (user?.id) {
        sessionSecurityService.reportSuspiciousActivity(
          user.id,
          activityType,
          { patterns: detectedPatterns, ...details }
        );
      }

      logSecurityEvent({
        eventType: 'suspicious_activity_detected',
        severity: detectedPatterns.length > 2 ? 'high' : 'medium',
        details: {
          activityType,
          detectedPatterns,
          ...details,
        },
      });
    }
  }, [logSecurityEvent, user]);

  const monitorFormValidation = useCallback((formType: string, errors: string[]) => {
    if (errors.length > 0) {
      logSecurityEvent({
        eventType: 'form_validation_failed',
        severity: 'low',
        details: {
          formType,
          errors,
          errorCount: errors.length,
        },
      });
    }
  }, [logSecurityEvent]);

  const monitorAPIError = useCallback((endpoint: string, error: any, statusCode?: number) => {
    const severity = statusCode === 403 || statusCode === 401 ? 'medium' : 'low';
    
    logSecurityEvent({
      eventType: 'api_error',
      severity,
      details: {
        endpoint,
        error: error.message || String(error),
        statusCode,
        stack: error.stack,
      },
    });
  }, [logSecurityEvent]);

  // Monitor page visibility changes for potential attacks
  useEffect(() => {
    let hiddenTime: number | null = null;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else if (hiddenTime) {
        const timeDiff = Date.now() - hiddenTime;
        
        // Detect potential tab-nabbing attacks
        if (timeDiff > 300000) { // 5 minutes
          logSecurityEvent({
            eventType: 'potential_tab_nabbing',
            severity: 'medium',
            details: {
              hiddenDuration: timeDiff,
              url: window.location.href,
            },
          });
        }
        
        hiddenTime = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logSecurityEvent]);

  // Monitor for potential XSS attempts
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      // Detect potential XSS patterns in console errors
      const xssPatterns = [
        /script.*src=/i,
        /javascript:/i,
        /data:text\/html/i,
        /eval\(/i,
        /innerHTML/i,
      ];
      
      if (xssPatterns.some(pattern => pattern.test(errorMessage))) {
        logSecurityEvent({
          eventType: 'potential_xss_attempt',
          severity: 'high',
          details: {
            errorMessage,
            stack: new Error().stack,
          },
        });
      }
      
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    detectSuspiciousActivity,
    monitorFormValidation,
    monitorAPIError,
  };
};