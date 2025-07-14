/**
 * Unified Security Service
 * Orchestrates all security services and provides a central interface
 */

import { rateLimitingService } from './rateLimitingService';
import { payloadValidationService } from './payloadValidationService';
import { userAgentAnalysisService } from './userAgentAnalysisService';
import { antiScrapingService } from './antiScrapingService';
import { threatDetectionService } from './threatDetectionService';
import { SecurityHeadersService } from './securityHeadersService';
import type { SecurityContext, SecurityResult } from './payloadValidationService';

export class UnifiedSecurityService {
  private securityHeadersService: SecurityHeadersService;

  constructor() {
    this.securityHeadersService = new SecurityHeadersService();
  }

  /**
   * Get comprehensive security statistics
   */
  getStats() {
    const rateLimitStats = rateLimitingService.getStats();
    return {
      rateLimiting: {
        activeLimits: rateLimitStats.activeLimits,
        blockedIPs: rateLimitStats.blockedIPs,
        suspiciousPatterns: rateLimitStats.suspiciousPatterns,
        limits: rateLimitStats.limits
      },
      userAgent: {
        patternsCount: 0, // userAgentAnalysisService doesn't expose this
        browserPatternsCount: 0 // userAgentAnalysisService doesn't expose this
      },
      timestamp: new Date().toISOString(),
      service: 'UnifiedSecurityService'
    };
  }

  /**
   * Comprehensive security check
   */
  async performSecurityCheck(
    context: SecurityContext,
    payload?: any,
    userAgent?: string
  ): Promise<SecurityResult> {
    // Rate limiting check
    const rateLimitResult = rateLimitingService.checkLimit(
      context.ipAddress || context.userId || 'unknown',
      {
        maxRequests: 60,
        windowMs: 60000,
        ipAddress: context.ipAddress,
        adaptive: true,
        trackViolations: true
      }
    );

    if (!rateLimitResult) {
      return { allowed: false, reason: 'Rate limit exceeded' };
    }

    // Payload validation
    if (payload) {
      const payloadResult = payloadValidationService.validatePayload(payload, context);
      if (!payloadResult.allowed) {
        return payloadResult;
      }
    }

    // User agent analysis
    if (userAgent) {
      const userAgentResult = userAgentAnalysisService.analyzeUserAgent(userAgent, context);
      if (!userAgentResult.allowed) {
        return userAgentResult;
      }
    }

    // Anti-scraping check
    const antiScrapingResult = await antiScrapingService.checkForScraping(context);
    if (!antiScrapingResult.allowed) {
      return antiScrapingResult;
    }

    // All checks passed
    return { allowed: true, reason: 'All security checks passed' };
  }

  /**
   * Get security headers
   */
  getSecurityHeaders(): Record<string, string> {
    return this.securityHeadersService.getAllSecurityHeaders();
  }

  /**
   * Get security score
   */
  getSecurityScore() {
    return this.securityHeadersService.getSecurityScore();
  }

  /**
   * Check request (backward compatibility)
   */
  async checkRequest(
    context: SecurityContext,
    payload?: any
  ): Promise<SecurityResult> {
    return this.performSecurityCheck(context, payload);
  }
}

/**
 * Security middleware wrapper
 */
export async function withSecurity<T>(
  context: SecurityContext,
  operation: () => Promise<T>,
  payload?: any,
  userAgent?: string
): Promise<T> {
  const securityResult = await unifiedSecurityService.performSecurityCheck(
    context,
    payload,
    userAgent
  );

  if (!securityResult.allowed) {
    throw new Error(`Security check failed: ${securityResult.reason}`);
  }

  return operation();
}

// Export singleton instance
export const unifiedSecurityService = new UnifiedSecurityService();