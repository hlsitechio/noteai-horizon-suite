/**
 * Rate limiting service with adaptive thresholds and IP blocking
 */
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  adaptive?: boolean;
  trackViolations?: boolean;
  ipAddress?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  violations: number;
}

export class RateLimitingService {
  private limits = new Map<string, RateLimitEntry>();
  private blockedIPs = new Set<string>();
  private suspiciousPatterns = new Map<string, number>();
  private readonly maxRequestsPerMinute = 60;
  private readonly maxRequestsPerHour = 1000;

  checkLimit(key: string, config: RateLimitConfig): boolean {
    const { maxRequests, windowMs, adaptive = true, trackViolations = true, ipAddress } = config;
    const now = Date.now();

    // Check if IP is blocked
    if (ipAddress && this.blockedIPs.has(ipAddress)) {
      this.logSecurityEvent('blocked_ip_access', { ipAddress, key });
      return false;
    }

    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs, violations: 0 });
      return true;
    }

    // Adaptive threshold based on previous violations
    let adaptiveMax = maxRequests;
    if (adaptive && limit.violations > 0) {
      adaptiveMax = Math.max(5, maxRequests - (limit.violations * 10));
    }

    if (limit.count >= adaptiveMax) {
      if (trackViolations) {
        limit.violations++;
        this.handleRateLimitViolation(key, ipAddress, limit.violations);
      }
      return false;
    }

    limit.count++;
    return true;
  }

  private handleRateLimitViolation(key: string, ipAddress?: string, violations?: number): void {
    this.logSecurityEvent('rate_limit_violation', {
      key,
      ipAddress,
      violations,
      timestamp: new Date().toISOString(),
    });

    // Block IP after repeated violations
    if (violations && violations > 3 && ipAddress) {
      this.blockIP(ipAddress, 60000); // 1 minute block
    }
  }

  private blockIP(ipAddress: string, durationMs: number): void {
    this.blockedIPs.add(ipAddress);
    setTimeout(() => {
      this.blockedIPs.delete(ipAddress);
      logger.info('IP unblocked', { ipAddress });
    }, durationMs);
    
    logger.warn('IP blocked for rate limit violations', { ipAddress, durationMs });
  }

  checkGlobalLimits(userId?: string, ipAddress?: string): boolean {
    const userKey = userId ? `user:${userId}` : `ip:${ipAddress}`;
    
    // Check per-minute limit
    const minuteCheck = this.checkLimit(`${userKey}:minute`, {
      maxRequests: this.maxRequestsPerMinute,
      windowMs: 60000,
      ipAddress,
      adaptive: true,
      trackViolations: true,
    });

    if (!minuteCheck) return false;

    // Check per-hour limit
    return this.checkLimit(`${userKey}:hour`, {
      maxRequests: this.maxRequestsPerHour,
      windowMs: 3600000,
      ipAddress,
      adaptive: true,
      trackViolations: true,
    });
  }

  reportSuspiciousPattern(pattern: string): void {
    const count = this.suspiciousPatterns.get(pattern) || 0;
    this.suspiciousPatterns.set(pattern, count + 1);

    if (count > 10) {
      this.logSecurityEvent('suspicious_pattern_threshold', {
        pattern,
        count: count + 1,
      });
    }
  }

  isPatternSuspicious(pattern: string): boolean {
    return (this.suspiciousPatterns.get(pattern) || 0) > 5;
  }

  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
        cleanedCount++;
      }
    }

    // Clean suspicious patterns periodically
    if (Math.random() < 0.1) {
      this.suspiciousPatterns.clear();
    }

    if (cleanedCount > 0) {
      logger.info('Rate limiter cleanup completed', { cleanedCount });
    }
  }

  getStats() {
    return {
      activeLimits: this.limits.size,
      blockedIPs: this.blockedIPs.size,
      suspiciousPatterns: this.suspiciousPatterns.size,
      limits: Array.from(this.limits.entries()).map(([key, limit]) => ({
        key,
        count: limit.count,
        violations: limit.violations,
      })),
    };
  }

  private logSecurityEvent(eventType: string, details: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      service: 'RateLimitingService',
      ...details,
    };

    logger.warn('SECURITY', eventType, details);

    Sentry.captureMessage(`Rate Limiting Event: ${eventType}`, {
      level: 'warning',
      tags: {
        security: true,
        service: 'rate_limiting',
        eventType,
      },
      extra: details,
    });
  }
}

export const rateLimitingService = new RateLimitingService();

// Cleanup every 5 minutes
setInterval(() => {
  rateLimitingService.cleanup();
}, 5 * 60 * 1000);