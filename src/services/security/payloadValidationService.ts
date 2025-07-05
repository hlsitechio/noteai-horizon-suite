/**
 * Payload validation service for security checks
 */
import { MALICIOUS_PATTERNS } from '@/utils/advancedInputValidation';
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export interface SecurityContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint: string;
  method: string;
}

export interface SecurityResult {
  allowed: boolean;
  reason?: string;
  action?: 'block' | 'monitor' | 'alert';
  threats?: string[];
}

export class PayloadValidationService {
  private readonly maxPayloadSize = 10 * 1024 * 1024; // 10MB

  validatePayload(payload: any, context: SecurityContext): SecurityResult {
    if (!payload) {
      return { allowed: true };
    }

    const payloadString = JSON.stringify(payload);
    
    // Check payload size
    const sizeCheck = this.checkPayloadSize(payloadString, context);
    if (!sizeCheck.allowed) {
      return sizeCheck;
    }

    // Check for malicious patterns
    const patternCheck = this.checkMaliciousPatterns(payloadString, context);
    if (!patternCheck.allowed) {
      return patternCheck;
    }

    // Check for suspicious structure
    const structureCheck = this.checkPayloadStructure(payload, context);
    if (!structureCheck.allowed) {
      return structureCheck;
    }

    return { allowed: true };
  }

  private checkPayloadSize(payloadString: string, context: SecurityContext): SecurityResult {
    if (payloadString.length > this.maxPayloadSize) {
      this.logSecurityEvent('oversized_payload', {
        context,
        payloadSize: payloadString.length,
        maxSize: this.maxPayloadSize,
      });

      return {
        allowed: false,
        reason: 'Payload too large',
        action: 'block',
      };
    }

    return { allowed: true };
  }

  private checkMaliciousPatterns(payloadString: string, context: SecurityContext): SecurityResult {
    const detectedThreats: string[] = [];

    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.test(payloadString)) {
        detectedThreats.push(pattern.source);
      }
    }

    if (detectedThreats.length > 0) {
      this.logSecurityEvent('malicious_payload_detected', {
        context,
        threats: detectedThreats,
        payloadSize: payloadString.length,
      });

      return {
        allowed: false,
        reason: 'Malicious content detected in payload',
        action: 'block',
        threats: detectedThreats,
      };
    }

    return { allowed: true };
  }

  private checkPayloadStructure(payload: any, context: SecurityContext): SecurityResult {
    try {
      // Check for deeply nested objects (potential DoS)
      const depth = this.getObjectDepth(payload);
      if (depth > 20) {
        this.logSecurityEvent('payload_too_deep', {
          context,
          depth,
          maxDepth: 20,
        });

        return {
          allowed: false,
          reason: 'Payload structure too complex',
          action: 'block',
        };
      }

      // Check for too many properties (potential DoS)
      const propertyCount = this.countProperties(payload);
      if (propertyCount > 1000) {
        this.logSecurityEvent('payload_too_many_properties', {
          context,
          propertyCount,
          maxProperties: 1000,
        });

        return {
          allowed: false,
          reason: 'Payload has too many properties',
          action: 'block',
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logSecurityEvent('payload_structure_error', {
        context,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        allowed: false,
        reason: 'Invalid payload structure',
        action: 'block',
      };
    }
  }

  private getObjectDepth(obj: any, depth = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return depth;
    }

    if (depth > 50) { // Prevent stack overflow
      return depth;
    }

    let maxDepth = depth;
    for (const value of Object.values(obj)) {
      const currentDepth = this.getObjectDepth(value, depth + 1);
      maxDepth = Math.max(maxDepth, currentDepth);
    }

    return maxDepth;
  }

  private countProperties(obj: any, count = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return count;
    }

    if (count > 2000) { // Prevent excessive counting
      return count;
    }

    let totalCount = count + Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      totalCount = this.countProperties(value, totalCount);
    }

    return totalCount;
  }

  private logSecurityEvent(eventType: string, details: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      service: 'PayloadValidationService',
      ...details,
    };

    logger.warn('SECURITY', eventType, details);

    Sentry.captureMessage(`Payload Security Event: ${eventType}`, {
      level: 'warning',
      tags: {
        security: true,
        service: 'payload_validation',
        eventType,
      },
      extra: details,
    });
  }
}

export const payloadValidationService = new PayloadValidationService();