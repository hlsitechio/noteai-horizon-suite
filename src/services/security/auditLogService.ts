/**
 * Enhanced audit logging service with retention policies and analysis
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/react';

export interface AuditEvent {
  eventType: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  payload?: any;
  result?: 'success' | 'failure' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface SecurityPattern {
  pattern: string;
  frequency: number;
  riskScore: number;
  lastSeen: Date;
  affectedUsers: Set<string>;
}

export class AuditLogService {
  private localEventCache: (AuditEvent & { timestamp: Date })[] = [];
  private maxCacheSize = 1000;
  private flushInterval = 30000; // 30 seconds
  private patterns = new Map<string, SecurityPattern>();
  private readonly retentionDays = 90;

  constructor() {
    this.startPeriodicFlush();
    this.startPatternAnalysis();
  }

  /**
   * Log a security event with enhanced metadata
   */
  async logEvent(event: AuditEvent): Promise<void> {
    const auditEvent: AuditEvent & { timestamp: Date } = {
      ...event,
      timestamp: event.timestamp || new Date(),
    };

    // Add to local cache for immediate analysis
    this.localEventCache.push(auditEvent);
    
    // Trim cache if needed
    if (this.localEventCache.length > this.maxCacheSize) {
      this.localEventCache = this.localEventCache.slice(-this.maxCacheSize);
    }

    // Analyze for patterns
    this.analyzeEventPatterns(auditEvent);

    // Log high-risk events immediately
    if (event.riskLevel === 'critical' || event.riskLevel === 'high') {
      await this.flushToDatabase([auditEvent]);
      
      // Send immediate alert for critical events
      if (event.riskLevel === 'critical') {
        this.sendSecurityAlert(auditEvent);
      }
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      logger.warn('AUDIT', event.eventType, {
        riskLevel: event.riskLevel,
        userId: event.userId,
        result: event.result,
      });
    }
  }

  /**
   * Analyze event patterns for suspicious behavior
   */
  private analyzeEventPatterns(event: AuditEvent & { timestamp: Date }): void {
    const patternKey = this.generatePatternKey(event);
    const existing = this.patterns.get(patternKey);

    if (existing) {
      existing.frequency++;
      existing.lastSeen = event.timestamp;
      if (event.userId) {
        existing.affectedUsers.add(event.userId);
      }
      
      // Increase risk score based on frequency and recency
      const timeDiff = Date.now() - existing.lastSeen.getTime();
      const timeMultiplier = timeDiff < 60000 ? 2 : 1; // Double risk if within 1 minute
      existing.riskScore = Math.min(100, existing.riskScore + (5 * timeMultiplier));
      
    } else {
      this.patterns.set(patternKey, {
        pattern: patternKey,
        frequency: 1,
        riskScore: this.calculateInitialRiskScore(event),
        lastSeen: event.timestamp,
        affectedUsers: new Set(event.userId ? [event.userId] : []),
      });
    }

    // Alert on high-risk patterns
    const pattern = this.patterns.get(patternKey)!;
    if (pattern.riskScore > 70 && pattern.frequency > 5) {
      this.reportSuspiciousPattern(pattern, event);
    }
  }

  /**
   * Generate a pattern key for event analysis
   */
  private generatePatternKey(event: AuditEvent): string {
    const components = [
      event.eventType,
      event.result || 'unknown',
      event.endpoint || 'unknown',
      event.method || 'unknown',
    ];
    
    return components.join('|');
  }

  /**
   * Calculate initial risk score for an event
   */
  private calculateInitialRiskScore(event: AuditEvent): number {
    let score = 10; // Base score

    // Risk factors
    const riskFactors = {
      critical: 50,
      high: 30,
      medium: 15,
      low: 5,
    };

    score += riskFactors[event.riskLevel];

    // Add risk for failures
    if (event.result === 'failure' || event.result === 'blocked') {
      score += 20;
    }

    // Add risk for sensitive endpoints
    if (event.endpoint?.includes('admin') || event.endpoint?.includes('auth')) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Report suspicious patterns
   */
  private reportSuspiciousPattern(pattern: SecurityPattern, triggerEvent: AuditEvent): void {
    const alert = {
      type: 'suspicious_pattern_detected',
      pattern: pattern.pattern,
      frequency: pattern.frequency,
      riskScore: pattern.riskScore,
      affectedUsers: Array.from(pattern.affectedUsers),
      triggerEvent: {
        eventType: triggerEvent.eventType,
        userId: triggerEvent.userId,
        ipAddress: triggerEvent.ipAddress,
        result: triggerEvent.result,
      },
      timestamp: new Date().toISOString(),
    };

    logger.warn('SECURITY PATTERN', 'Suspicious pattern detected', alert);
    
    Sentry.captureMessage('Suspicious security pattern detected', {
      level: 'warning',
      tags: {
        security: true,
        pattern: pattern.pattern,
        riskScore: pattern.riskScore,
      },
      extra: alert,
    });

    // Reset pattern risk score after reporting
    pattern.riskScore = Math.max(10, pattern.riskScore * 0.5);
  }

  /**
   * Send security alert for critical events
   */
  private sendSecurityAlert(event: AuditEvent): void {
    const alert = {
      level: 'CRITICAL',
      eventType: event.eventType,
      userId: event.userId,
      ipAddress: event.ipAddress,
      timestamp: new Date().toISOString(),
      metadata: event.metadata,
    };

    logger.error('CRITICAL SECURITY EVENT', alert);
    
    Sentry.captureMessage('Critical security event', {
      level: 'error',
      tags: {
        security: true,
        critical: true,
        eventType: event.eventType,
      },
      extra: alert,
    });
  }

  /**
   * Flush cached events to database
   */
  private async flushToDatabase(events: (AuditEvent & { timestamp: Date })[]): Promise<void> {
    if (events.length === 0) return;

    try {
      const auditEntries = events.map(event => ({
        user_id: event.userId || null,
        action: event.eventType,
        table_name: 'security_audit',
        new_values: {
          eventType: event.eventType,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          endpoint: event.endpoint,
          method: event.method,
          result: event.result,
          riskLevel: event.riskLevel,
          metadata: event.metadata,
          timestamp: event.timestamp.toISOString(),
        },
      }));

      const { error } = await supabase
        .from('security_audit_log')
        .insert(auditEntries);

      if (error) {
        logger.error('Failed to flush audit events to database', error);
      } else {
        logger.info('Flushed audit events to database', { count: events.length });
      }
    } catch (error) {
      logger.error('Error flushing audit events', error);
    }
  }

  /**
   * Start periodic flush of cached events
   */
  private startPeriodicFlush(): void {
    setInterval(async () => {
      if (this.localEventCache.length > 0) {
        const eventsToFlush = [...this.localEventCache];
        this.localEventCache = [];
        await this.flushToDatabase(eventsToFlush);
      }
    }, this.flushInterval);
  }

  /**
   * Start pattern analysis cleanup
   */
  private startPatternAnalysis(): void {
    setInterval(() => {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      // Clean up old patterns
      for (const [key, pattern] of this.patterns.entries()) {
        if (pattern.lastSeen.getTime() < oneHourAgo) {
          this.patterns.delete(key);
        }
      }
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Get audit statistics
   */
  getAuditStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentEvents = this.localEventCache.filter(
      event => event.timestamp && event.timestamp.getTime() > oneHourAgo
    );

    const riskDistribution = recentEvents.reduce((acc, event) => {
      acc[event.riskLevel] = (acc[event.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCachedEvents: this.localEventCache.length,
      recentEventCount: recentEvents.length,
      activePatterns: this.patterns.size,
      riskDistribution,
      highRiskPatterns: Array.from(this.patterns.values())
        .filter(p => p.riskScore > 50)
        .length,
      topPatterns: Array.from(this.patterns.values())
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)
        .map(p => ({
          pattern: p.pattern,
          frequency: p.frequency,
          riskScore: p.riskScore,
          affectedUsers: p.affectedUsers.size,
        })),
    };
  }

  /**
   * Search audit logs
   */
  async searchAuditLogs(filters: {
    userId?: string;
    eventType?: string;
    riskLevel?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }) {
    try {
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.eventType) {
        query = query.eq('action', filters.eventType);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom.toISOString());
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo.toISOString());
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Failed to search audit logs', error);
      return [];
    }
  }
}

export const auditLogService = new AuditLogService();