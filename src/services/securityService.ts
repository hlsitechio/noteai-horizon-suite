import { rateLimiter } from '@/utils/securityUtils';
import { MALICIOUS_PATTERNS } from '@/utils/advancedInputValidation';
import * as Sentry from '@sentry/react';
import { logger } from '@/utils/logger';

interface SecurityContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint: string;
  method: string;
}

interface SecurityResult {
  allowed: boolean;
  reason?: string;
  action?: 'block' | 'monitor' | 'alert';
}

export class SecurityService {
  private readonly maxRequestsPerMinute = 60;
  private readonly maxRequestsPerHour = 1000;

  /**
   * Pre-request security check
   */
  async checkRequest(
    context: SecurityContext,
    payload?: any
  ): Promise<SecurityResult> {
    const { userId, ipAddress, userAgent, endpoint, method } = context;

    // Rate limiting check
    const rateLimitKey = userId ? `user:${userId}` : `ip:${ipAddress}`;
    
    if (!rateLimiter.checkLimit(
      `${rateLimitKey}:minute`,
      this.maxRequestsPerMinute,
      60000,
      { ipAddress, adaptive: true, trackViolations: true }
    )) {
      this.logSecurityEvent('rate_limit_exceeded', {
        context,
        window: 'minute',
        limit: this.maxRequestsPerMinute,
      });
      
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        action: 'block',
      };
    }

    // Payload security check
    if (payload) {
      const payloadCheck = this.checkPayloadSecurity(payload, context);
      if (!payloadCheck.allowed) {
        return payloadCheck;
      }
    }

    // User agent analysis
    if (userAgent) {
      const uaCheck = this.analyzeUserAgent(userAgent, context);
      if (!uaCheck.allowed) {
        return uaCheck;
      }
    }

    // Endpoint-specific checks
    const endpointCheck = this.checkEndpointSecurity(endpoint, method, context);
    if (!endpointCheck.allowed) {
      return endpointCheck;
    }

    return { allowed: true };
  }

  /**
   * Check payload for malicious content
   */
  private checkPayloadSecurity(
    payload: any,
    context: SecurityContext
  ): SecurityResult {
    const payloadString = JSON.stringify(payload);
    
    // Check for malicious patterns
    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.test(payloadString)) {
        this.logSecurityEvent('malicious_payload_detected', {
          context,
          pattern: pattern.source,
          payloadSize: payloadString.length,
        });
        
        rateLimiter.reportSuspiciousPattern(pattern.source);
        
        return {
          allowed: false,
          reason: 'Malicious content detected in payload',
          action: 'block',
        };
      }
    }

    // Check payload size
    if (payloadString.length > 10 * 1024 * 1024) { // 10MB
      this.logSecurityEvent('oversized_payload', {
        context,
        payloadSize: payloadString.length,
      });
      
      return {
        allowed: false,
        reason: 'Payload too large',
        action: 'block',
      };
    }

    return { allowed: true };
  }

  /**
   * Analyze user agent for suspicious patterns
   */
  private analyzeUserAgent(
    userAgent: string,
    context: SecurityContext
  ): SecurityResult {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /php/i,
      /java/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        this.logSecurityEvent('suspicious_user_agent', {
          context,
          userAgent: userAgent.substring(0, 200),
          pattern: pattern.source,
        });
        
        return {
          allowed: true,
          action: 'monitor',
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Endpoint-specific security checks
   */
  private checkEndpointSecurity(
    endpoint: string,
    method: string,
    context: SecurityContext
  ): SecurityResult {
    // Admin endpoint protection
    if (endpoint.includes('/admin') && !context.userId) {
      this.logSecurityEvent('unauthorized_admin_access', {
        context,
        endpoint,
      });
      
      return {
        allowed: false,
        reason: 'Authentication required for admin endpoints',
        action: 'block',
      };
    }

    return { allowed: true };
  }

  /**
   * Log security events
   */
  private logSecurityEvent(
    eventType: string,
    details: any
  ) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...details,
    };

    // Use proper logger
    logger.warn('SECURITY', eventType, details);

    // Send to Sentry
    Sentry.captureMessage(`Security Event: ${eventType}`, {
      level: 'warning',
      tags: {
        security: true,
        eventType,
      },
      extra: details,
    });
  }

  /**
   * Get security statistics
   */
  getStats() {
    return {
      rateLimiter: rateLimiter.getStats(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const securityService = new SecurityService();

/**
 * Security wrapper for API calls
 */
export const withSecurity = async <T>(
  context: SecurityContext,
  operation: () => Promise<T>,
  payload?: any
): Promise<T> => {
  const securityCheck = await securityService.checkRequest(context, payload);
  
  if (!securityCheck.allowed) {
    throw new Error(`Security check failed: ${securityCheck.reason}`);
  }
  
  try {
    return await operation();
  } catch (error) {
    logger.error('SECURITY', 'Operation failed:', error);
    throw error;
  }
};