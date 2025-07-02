import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import * as Sentry from '@sentry/react';

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
      // Log to Supabase audit log
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: user?.id || null,
          action: event.eventType,
          table_name: 'security_monitoring',
          new_values: {
            ...event.details,
            severity: event.severity,
            user_agent: event.userAgent || navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }

      // Log to Sentry based on severity
      if (event.severity === 'high' || event.severity === 'critical') {
        Sentry.captureMessage(`Security Event: ${event.eventType}`, {
          level: event.severity === 'critical' ? 'error' : 'warning',
          tags: {
            eventType: event.eventType,
            severity: event.severity,
          },
          extra: event.details,
        });
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
    };

    const detectedPatterns = Object.entries(suspiciousPatterns)
      .filter(([, detected]) => detected)
      .map(([pattern]) => pattern);

    if (detectedPatterns.length > 0) {
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
  }, [logSecurityEvent]);

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