/**
 * User Agent Analysis Service for detecting suspicious clients
 */
import { logger } from '@/utils/logger';
import type { SecurityContext, SecurityResult } from './payloadValidationService';

interface UserAgentAnalysis {
  isSuspicious: boolean;
  confidence: number;
  reasons: string[];
  category: 'browser' | 'bot' | 'crawler' | 'tool' | 'unknown';
}

export class UserAgentAnalysisService {
  private readonly suspiciousPatterns = [
    { pattern: /bot/i, category: 'bot', weight: 0.8 },
    { pattern: /crawler/i, category: 'crawler', weight: 0.8 },
    { pattern: /spider/i, category: 'crawler', weight: 0.8 },
    { pattern: /scraper/i, category: 'tool', weight: 0.9 },
    { pattern: /curl/i, category: 'tool', weight: 0.9 },
    { pattern: /wget/i, category: 'tool', weight: 0.9 },
    { pattern: /python/i, category: 'tool', weight: 0.7 },
    { pattern: /php/i, category: 'tool', weight: 0.7 },
    { pattern: /java/i, category: 'tool', weight: 0.6 },
    { pattern: /node/i, category: 'tool', weight: 0.6 },
    { pattern: /postman/i, category: 'tool', weight: 0.5 },
  ] as const;

  private readonly legitimateBrowsers = [
    /Chrome\/[\d.]+/,
    /Firefox\/[\d.]+/,
    /Safari\/[\d.]+/,
    /Edge\/[\d.]+/,
    /Opera\/[\d.]+/,
  ];

  analyzeUserAgent(userAgent: string, context: SecurityContext): SecurityResult {
    if (!userAgent) {
      return this.createSuspiciousResult('Missing user agent', context);
    }

    const analysis = this.performAnalysis(userAgent);

    // Log analysis for monitoring
    this.logAnalysis(userAgent, analysis, context);

    // Determine action based on analysis
    if (analysis.isSuspicious && analysis.confidence > 0.8) {
      return {
        allowed: false,
        reason: `Suspicious user agent: ${analysis.reasons.join(', ')}`,
        action: 'block',
      };
    }

    if (analysis.isSuspicious && analysis.confidence > 0.5) {
      return {
        allowed: true,
        action: 'monitor',
      };
    }

    return { allowed: true };
  }

  private performAnalysis(userAgent: string): UserAgentAnalysis {
    const reasons: string[] = [];
    let suspicionScore = 0;
    let category: UserAgentAnalysis['category'] = 'unknown';

    // Check against suspicious patterns
    for (const { pattern, category: patternCategory, weight } of this.suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        reasons.push(`Matches ${patternCategory} pattern: ${pattern.source}`);
        suspicionScore += weight;
        category = patternCategory;
      }
    }

    // Check if it looks like a legitimate browser
    const isLegitBrowser = this.legitimateBrowsers.some(pattern => pattern.test(userAgent));
    if (isLegitBrowser && suspicionScore === 0) {
      category = 'browser';
    }

    // Check for unusual characteristics
    if (userAgent.length > 1000) {
      reasons.push('Unusually long user agent');
      suspicionScore += 0.3;
    }

    if (userAgent.length < 10) {
      reasons.push('Unusually short user agent');
      suspicionScore += 0.5;
    }

    // Check for multiple conflicting browser identifiers
    const browserMatches = this.legitimateBrowsers.filter(pattern => pattern.test(userAgent));
    if (browserMatches.length > 2) {
      reasons.push('Multiple conflicting browser identifiers');
      suspicionScore += 0.4;
    }

    // Check for suspicious version patterns
    if (/\d{4,}/.test(userAgent)) {
      reasons.push('Suspicious version numbers');
      suspicionScore += 0.2;
    }

    // Normalize suspicion score
    const confidence = Math.min(suspicionScore, 1);
    const isSuspicious = confidence > 0.3;

    return {
      isSuspicious,
      confidence,
      reasons,
      category,
    };
  }

  private createSuspiciousResult(reason: string, context: SecurityContext): SecurityResult {
    this.logSecurityEvent('suspicious_user_agent', {
      context,
      reason,
    });

    return {
      allowed: true,
      action: 'monitor',
    };
  }

  private logAnalysis(userAgent: string, analysis: UserAgentAnalysis, context: SecurityContext): void {
    if (analysis.isSuspicious) {
      this.logSecurityEvent('user_agent_analysis', {
        context,
        userAgent: userAgent.substring(0, 200), // Truncate for security
        analysis: {
          category: analysis.category,
          confidence: analysis.confidence,
          reasons: analysis.reasons,
        },
      });
    }
  }

  private logSecurityEvent(eventType: string, details: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      service: 'UserAgentAnalysisService',
      ...details,
    };

    if (details.analysis?.confidence > 0.7) {
      logger.warn('SECURITY', eventType, details);
    } else {
      logger.info('SECURITY', eventType, details);
    }

    // High confidence security events are logged for monitoring
  }

  getStats() {
    return {
      patternsCount: this.suspiciousPatterns.length,
      browserPatternsCount: this.legitimateBrowsers.length,
    };
  }
}

export const userAgentAnalysisService = new UserAgentAnalysisService();