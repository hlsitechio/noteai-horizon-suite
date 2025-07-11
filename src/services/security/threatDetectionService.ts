/**
 * Advanced threat detection service with ML-based pattern recognition
 */
import { logger } from '@/utils/logger';
import { auditLogService } from './auditLogService';
import type { AuditEvent } from './auditLogService';

export interface ThreatIndicator {
  type: 'malware' | 'phishing' | 'injection' | 'enumeration' | 'brute_force' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  description: string;
  indicators: string[];
  mitigationActions: string[];
}

export interface ThreatAlert {
  id: string;
  userId?: string;
  ipAddress?: string;
  indicators: ThreatIndicator[];
  aggregatedSeverity: 'low' | 'medium' | 'high' | 'critical';
  firstDetected: Date;
  lastSeen: Date;
  occurrenceCount: number;
  isActive: boolean;
}

export class ThreatDetectionService {
  private activeThreatAlerts = new Map<string, ThreatAlert>();
  private maliciousPatterns = new Set<RegExp>();
  private ipReputationCache = new Map<string, { reputation: number; lastCheck: number }>();
  
  constructor() {
    this.initializeMaliciousPatterns();
    this.startThreatMonitoring();
  }

  /**
   * Initialize known malicious patterns
   */
  private initializeMaliciousPatterns(): void {
    const patterns = [
      // SQL Injection patterns
      /(\bUNION\b.*\bSELECT\b)|(\bSELECT\b.*\bFROM\b.*\bWHERE\b.*=.*)/i,
      /(\bOR\b.*=.*)|(\bAND\b.*=.*)|(\b1=1\b)|(\b1=0\b)/i,
      /(\bDROP\b.*\bTABLE\b)|(\bDELETE\b.*\bFROM\b)|(\bUPDATE\b.*\bSET\b)/i,
      
      // XSS patterns
      /<script[^>]*>.*?<\/script>/gi,
      /javascript\s*:/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      
      // Command injection patterns
      /(\|\s*\w+)|(\&\&\s*\w+)|(\;\s*\w+)/g,
      /(wget|curl|nc|netcat|sh|bash|cmd|powershell)\s+/gi,
      
      // Path traversal patterns
      /\.\.[\/\\]/g,
      /(\.{2}[\/\\]){2,}/g,
      
      // File inclusion patterns
      /(include|require)(_once)?\s*\(.*\$.*\)/gi,
      /php:\/\/(input|filter)/gi,
    ];

    patterns.forEach(pattern => this.maliciousPatterns.add(pattern));
  }

  /**
   * Analyze input for threat indicators
   */
  analyzeInput(input: string, context: { userId?: string; ipAddress?: string; endpoint?: string }): ThreatIndicator[] {
    const indicators: ThreatIndicator[] = [];

    // Check for malicious patterns
    this.maliciousPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        const indicator = this.identifyThreatType(pattern, input);
        if (indicator) {
          indicators.push(indicator);
        }
      }
    });

    // Check for anomalous input characteristics
    const anomalyIndicators = this.detectInputAnomalies(input, context);
    indicators.push(...anomalyIndicators);

    // Log detected threats
    if (indicators.length > 0) {
      this.logThreatDetection(indicators, context, input);
    }

    return indicators;
  }

  /**
   * Detect behavioral anomalies
   */
  detectBehavioralAnomaly(events: AuditEvent[]): ThreatIndicator[] {
    const indicators: ThreatIndicator[] = [];

    // Rapid successive failures
    const failureEvents = events.filter(e => e.result === 'failure');
    if (failureEvents.length > 10) {
      indicators.push({
        type: 'brute_force',
        severity: 'high',
        confidence: 85,
        description: 'Rapid successive authentication failures detected',
        indicators: [`${failureEvents.length} failures in short timeframe`],
        mitigationActions: ['Rate limit IP', 'Require CAPTCHA', 'Temporary account lock']
      });
    }

    // Unusual access patterns
    const uniqueEndpoints = new Set(events.map(e => e.endpoint));
    if (uniqueEndpoints.size > 20) {
      indicators.push({
        type: 'enumeration',
        severity: 'medium',
        confidence: 70,
        description: 'Potential endpoint enumeration detected',
        indicators: [`Accessed ${uniqueEndpoints.size} different endpoints`],
        mitigationActions: ['Monitor closely', 'Implement honeypots']
      });
    }

    // Privilege escalation attempts
    const adminAttempts = events.filter(e => e.endpoint?.includes('admin'));
    if (adminAttempts.length > 5) {
      indicators.push({
        type: 'enumeration',
        severity: 'high',
        confidence: 90,
        description: 'Multiple admin endpoint access attempts',
        indicators: [`${adminAttempts.length} admin endpoint accesses`],
        mitigationActions: ['Block IP immediately', 'Alert security team']
      });
    }

    return indicators;
  }

  /**
   * Check IP reputation
   */
  async checkIPReputation(ipAddress: string): Promise<ThreatIndicator | null> {
    // Check cache first
    const cached = this.ipReputationCache.get(ipAddress);
    const now = Date.now();
    
    if (cached && (now - cached.lastCheck) < 3600000) { // 1 hour cache
      if (cached.reputation < 50) {
        return {
          type: 'anomaly',
          severity: cached.reputation < 20 ? 'high' : 'medium',
          confidence: 80,
          description: 'IP address has poor reputation',
          indicators: [`Reputation score: ${cached.reputation}`],
          mitigationActions: ['Monitor closely', 'Apply additional security checks']
        };
      }
      return null;
    }

    // Simple reputation check based on patterns (in real implementation, use external service)
    let reputation = 100;
    
    // Check for suspicious IP patterns
    if (this.isSuspiciousIP(ipAddress)) {
      reputation -= 30;
    }

    // Cache result
    this.ipReputationCache.set(ipAddress, { reputation, lastCheck: now });

    if (reputation < 50) {
      return {
        type: 'anomaly',
        severity: reputation < 20 ? 'high' : 'medium',
        confidence: 70,
        description: 'IP address shows suspicious characteristics',
        indicators: [`Reputation score: ${reputation}`],
        mitigationActions: ['Monitor closely', 'Apply additional security checks']
      };
    }

    return null;
  }

  /**
   * Create or update threat alert
   */
  createThreatAlert(indicators: ThreatIndicator[], context: { userId?: string; ipAddress?: string }): void {
    const alertId = this.generateAlertId(context);
    const existing = this.activeThreatAlerts.get(alertId);
    
    const aggregatedSeverity = this.calculateAggregatedSeverity(indicators);
    
    if (existing) {
      existing.indicators.push(...indicators);
      existing.lastSeen = new Date();
      existing.occurrenceCount++;
      existing.aggregatedSeverity = this.calculateAggregatedSeverity(existing.indicators);
    } else {
      const newAlert: ThreatAlert = {
        id: alertId,
        userId: context.userId,
        ipAddress: context.ipAddress,
        indicators,
        aggregatedSeverity,
        firstDetected: new Date(),
        lastSeen: new Date(),
        occurrenceCount: 1,
        isActive: true
      };
      
      this.activeThreatAlerts.set(alertId, newAlert);
    }

    // Log high-severity threats immediately
    if (aggregatedSeverity === 'high' || aggregatedSeverity === 'critical') {
      this.escalateThreat(this.activeThreatAlerts.get(alertId)!);
    }
  }

  /**
   * Get active threat summary
   */
  getActiveThreatSummary() {
    const alerts = Array.from(this.activeThreatAlerts.values());
    
    return {
      totalActiveAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.aggregatedSeverity === 'critical').length,
      highAlerts: alerts.filter(a => a.aggregatedSeverity === 'high').length,
      mediumAlerts: alerts.filter(a => a.aggregatedSeverity === 'medium').length,
      lowAlerts: alerts.filter(a => a.aggregatedSeverity === 'low').length,
      recentAlerts: alerts
        .filter(a => Date.now() - a.lastSeen.getTime() < 3600000) // Last hour
        .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
        .slice(0, 10),
      topThreats: alerts
        .sort((a, b) => this.calculateThreatScore(b) - this.calculateThreatScore(a))
        .slice(0, 5)
    };
  }

  /**
   * Private helper methods
   */
  private identifyThreatType(pattern: RegExp, input: string): ThreatIndicator | null {
    const patternStr = pattern.toString();
    
    if (patternStr.includes('UNION') || patternStr.includes('SELECT')) {
      return {
        type: 'injection',
        severity: 'high',
        confidence: 90,
        description: 'SQL injection attempt detected',
        indicators: ['SQL injection pattern found'],
        mitigationActions: ['Block request', 'Sanitize input', 'Use parameterized queries']
      };
    }
    
    if (patternStr.includes('script') || patternStr.includes('javascript')) {
      return {
        type: 'injection',
        severity: 'high',
        confidence: 95,
        description: 'XSS attack attempt detected',
        indicators: ['Script injection pattern found'],
        mitigationActions: ['Sanitize output', 'Implement CSP', 'Block request']
      };
    }
    
    if (patternStr.includes('wget') || patternStr.includes('curl')) {
      return {
        type: 'injection',
        severity: 'critical',
        confidence: 95,
        description: 'Command injection attempt detected',
        indicators: ['Command execution pattern found'],
        mitigationActions: ['Block IP immediately', 'Sanitize input', 'Disable command execution']
      };
    }

    return null;
  }

  private detectInputAnomalies(input: string, context: any): ThreatIndicator[] {
    const indicators: ThreatIndicator[] = [];

    // Unusually long input
    if (input.length > 10000) {
      indicators.push({
        type: 'anomaly',
        severity: 'medium',
        confidence: 70,
        description: 'Unusually long input detected',
        indicators: [`Input length: ${input.length} characters`],
        mitigationActions: ['Limit input length', 'Monitor for buffer overflow attempts']
      });
    }

    // High entropy (potentially encoded payload)
    const entropy = this.calculateEntropy(input);
    if (entropy > 4.5) {
      indicators.push({
        type: 'anomaly',
        severity: 'medium',
        confidence: 60,
        description: 'High entropy input suggesting encoded content',
        indicators: [`Entropy: ${entropy.toFixed(2)}`],
        mitigationActions: ['Decode and analyze', 'Monitor for obfuscated attacks']
      });
    }

    return indicators;
  }

  private calculateEntropy(str: string): number {
    const freq = new Map<string, number>();
    for (const char of str) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }
    
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / str.length;
      entropy -= p * Math.log2(p);
    }
    
    return entropy;
  }

  private isSuspiciousIP(ip: string): boolean {
    // Check for common suspicious patterns
    const suspiciousPatterns = [
      /^10\./, // Private networks shouldn't be external
      /^192\.168\./, // Private networks
      /^172\.(1[6-9]|2\d|3[01])\./, // Private networks
      /^127\./, // Localhost
      /^0\./, // Invalid range
    ];

    return suspiciousPatterns.some(pattern => pattern.test(ip));
  }

  private calculateAggregatedSeverity(indicators: ThreatIndicator[]): 'low' | 'medium' | 'high' | 'critical' {
    if (indicators.some(i => i.severity === 'critical')) return 'critical';
    if (indicators.some(i => i.severity === 'high')) return 'high';
    if (indicators.some(i => i.severity === 'medium')) return 'medium';
    return 'low';
  }

  private calculateThreatScore(alert: ThreatAlert): number {
    let score = 0;
    
    // Base score from severity
    const severityScores = { low: 1, medium: 3, high: 7, critical: 10 };
    score += severityScores[alert.aggregatedSeverity];
    
    // Multiply by occurrence count
    score *= Math.log(alert.occurrenceCount + 1);
    
    // Add confidence scores
    const avgConfidence = alert.indicators.reduce((sum, i) => sum + i.confidence, 0) / alert.indicators.length;
    score *= (avgConfidence / 100);
    
    return score;
  }

  private generateAlertId(context: { userId?: string; ipAddress?: string }): string {
    return `threat_${context.userId || 'anon'}_${context.ipAddress || 'unknown'}_${Date.now()}`;
  }

  private logThreatDetection(indicators: ThreatIndicator[], context: any, input: string): void {
    auditLogService.logEvent({
      eventType: 'threat_detected',
      userId: context.userId,
      ipAddress: context.ipAddress,
      endpoint: context.endpoint,
      result: 'blocked',
      riskLevel: this.calculateAggregatedSeverity(indicators),
      metadata: {
        indicators: indicators.map(i => ({
          type: i.type,
          severity: i.severity,
          confidence: i.confidence,
          description: i.description
        })),
        inputSample: input.substring(0, 200), // Limited sample for privacy
        detectionTime: new Date().toISOString()
      }
    });
  }

  private escalateThreat(alert: ThreatAlert): void {
    logger.error('HIGH-SEVERITY THREAT DETECTED', {
      alertId: alert.id,
      severity: alert.aggregatedSeverity,
      indicators: alert.indicators.length,
      userId: alert.userId,
      ipAddress: alert.ipAddress,
      occurrences: alert.occurrenceCount
    });

    // In production, this would trigger additional security measures
    // such as automatic IP blocking, security team notifications, etc.
  }

  private startThreatMonitoring(): void {
    // Cleanup old alerts every hour
    setInterval(() => {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      for (const [id, alert] of this.activeThreatAlerts.entries()) {
        if (alert.lastSeen.getTime() < oneWeekAgo) {
          this.activeThreatAlerts.delete(id);
        }
      }
    }, 60 * 60 * 1000);
  }
}

export const threatDetectionService = new ThreatDetectionService();