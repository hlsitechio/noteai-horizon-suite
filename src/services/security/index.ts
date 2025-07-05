/**
 * Security services index - refactored from monolithic SecurityService
 */
export { rateLimitingService } from './rateLimitingService';
export { payloadValidationService } from './payloadValidationService';
export { userAgentAnalysisService } from './userAgentAnalysisService';
export type { SecurityContext, SecurityResult } from './payloadValidationService';

import { rateLimitingService } from './rateLimitingService';
import { payloadValidationService } from './payloadValidationService';
import { userAgentAnalysisService } from './userAgentAnalysisService';
import { logger } from '@/utils/logger';
import type { SecurityContext, SecurityResult } from './payloadValidationService';

/**
 * Unified Security Service that orchestrates all security checks
 */
export class UnifiedSecurityService {
  /**
   * Comprehensive security check for incoming requests
   */
  async checkRequest(context: SecurityContext, payload?: any): Promise<SecurityResult> {
    const { userId, ipAddress, userAgent, endpoint, method } = context;

    // 1. Rate limiting check
    const rateLimitKey = userId ? `user:${userId}` : `ip:${ipAddress}`;
    if (!rateLimitingService.checkGlobalLimits(userId, ipAddress)) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        action: 'block',
      };
    }

    // 2. User agent analysis
    if (userAgent) {
      const userAgentResult = userAgentAnalysisService.analyzeUserAgent(userAgent, context);
      if (!userAgentResult.allowed) {
        return userAgentResult;
      }
    }

    // 3. Payload validation
    if (payload) {
      const payloadResult = payloadValidationService.validatePayload(payload, context);
      if (!payloadResult.allowed) {
        return payloadResult;
      }
    }

    // 4. Endpoint-specific checks
    const endpointResult = this.checkEndpointSecurity(endpoint, method, context);
    if (!endpointResult.allowed) {
      return endpointResult;
    }

    return { allowed: true };
  }

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

    // Sensitive endpoint protection
    const sensitiveEndpoints = ['/api/users', '/api/settings', '/api/admin'];
    if (sensitiveEndpoints.some(se => endpoint.includes(se)) && method !== 'GET' && !context.userId) {
      this.logSecurityEvent('unauthorized_sensitive_access', {
        context,
        endpoint,
        method,
      });

      return {
        allowed: false,
        reason: 'Authentication required for sensitive endpoints',
        action: 'block',
      };
    }

    return { allowed: true };
  }

  /**
   * Get comprehensive security statistics
   */
  getStats() {
    return {
      rateLimiting: rateLimitingService.getStats(),
      userAgent: userAgentAnalysisService.getStats(),
      timestamp: new Date().toISOString(),
      service: 'UnifiedSecurityService',
    };
  }

  private logSecurityEvent(eventType: string, details: any): void {
    logger.warn('SECURITY', eventType, details);
  }
}

export const unifiedSecurityService = new UnifiedSecurityService();

/**
 * Security wrapper for API calls - simplified interface
 */
export const withSecurity = async <T>(
  context: SecurityContext,
  operation: () => Promise<T>,
  payload?: any
): Promise<T> => {
  const securityCheck = await unifiedSecurityService.checkRequest(context, payload);

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