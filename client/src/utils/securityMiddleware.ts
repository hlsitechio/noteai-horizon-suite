/**
 * Legacy security middleware - use SecurityService instead
 * @deprecated Use SecurityService from services/securityService.ts
 */

import { securityService } from '../services/securityService';
import { logger } from './logger';

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

/**
 * @deprecated Use SecurityService instead
 */
class SecurityMiddleware {
  private readonly maxRequestsPerMinute = 60;
  private readonly maxRequestsPerHour = 1000;
  private readonly suspiciousThreshold = 5;

  /**
   * @deprecated Use SecurityService.checkRequest instead
   */
  async checkRequest(
    context: SecurityContext,
    payload?: any
  ): Promise<SecurityResult> {
    // Delegate to new SecurityService
    return securityService.checkRequest(context, payload);
  }

  /**
   * @deprecated Use SecurityService.getStats instead
   */
  getStats() {
    return securityService.getStats();
  }
}

/**
 * @deprecated Use SecurityService instead
 */
export const securityMiddleware = new SecurityMiddleware();

/**
 * @deprecated Use withSecurity from services/securityService.ts instead
 */
export const withSecurity = async <T>(
  context: SecurityContext,
  operation: () => Promise<T>,
  payload?: any
): Promise<T> => {
  // Delegate to new SecurityService
  const { withSecurity: newWithSecurity } = await import('../services/securityService');
  return newWithSecurity(context, operation, payload);
};