/**
 * Alternative CSP Violation Reporting Service
 * Provides CSP violation tracking without relying on report-uri directive
 */

import { logger } from '@/utils/logger';

interface CSPViolationReport {
  timestamp: string;
  documentUri: string;
  violatedDirective: string;
  blockedUri: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  severity: 'high' | 'medium' | 'low';
  category: string;
}

export class AlternativeCSPReportingService {
  private static instance: AlternativeCSPReportingService;
  private violationReports: CSPViolationReport[] = [];
  private readonly maxReports = 100;

  static getInstance(): AlternativeCSPReportingService {
    if (!AlternativeCSPReportingService.instance) {
      AlternativeCSPReportingService.instance = new AlternativeCSPReportingService();
    }
    return AlternativeCSPReportingService.instance;
  }

  /**
   * Initialize alternative CSP violation reporting
   */
  initialize(): void {
    // Set up CSP violation event listener
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleViolation(event);
    });

    // Set up periodic reporting
    this.setupPeriodicReporting();

    logger.security.info('✅ Alternative CSP reporting initialized');
  }

  /**
   * Handle CSP violation event
   */
  private handleViolation(event: SecurityPolicyViolationEvent): void {
    const violation: CSPViolationReport = {
      timestamp: new Date().toISOString(),
      documentUri: event.documentURI,
      violatedDirective: event.violatedDirective,
      blockedUri: event.blockedURI,
      sourceFile: event.sourceFile || undefined,
      lineNumber: event.lineNumber || undefined,
      columnNumber: event.columnNumber || undefined,
      severity: this.analyzeSeverity(event.violatedDirective, event.blockedURI),
      category: this.categorizeViolation(event.violatedDirective, event.blockedURI)
    };

    // Store violation report
    this.storeViolation(violation);

    // Log violation
    this.logViolation(violation);
  }

  /**
   * Store violation report with rotation
   */
  private storeViolation(violation: CSPViolationReport): void {
    this.violationReports.push(violation);

    // Rotate old reports
    if (this.violationReports.length > this.maxReports) {
      this.violationReports = this.violationReports.slice(-this.maxReports);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('csp_violations', JSON.stringify(this.violationReports.slice(-20)));
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  /**
   * Log violation with appropriate level
   */
  private logViolation(violation: CSPViolationReport): void {
    const logMessage = `CSP Violation: ${violation.violatedDirective} blocked ${violation.blockedUri}`;
    
    switch (violation.severity) {
      case 'high':
        logger.security.error(logMessage, violation);
        break;
      case 'medium':
        logger.security.warn(logMessage, violation);
        break;
      case 'low':
        logger.security.debug(logMessage, violation);
        break;
    }
  }

  /**
   * Analyze violation severity
   */
  private analyzeSeverity(directive: string, blockedUri: string): 'high' | 'medium' | 'low' {
    // High severity: Script execution violations
    if (directive.includes('script-src') && 
        (blockedUri.includes('eval') || blockedUri.includes('inline') || blockedUri === 'self')) {
      return 'high';
    }

    // High severity: Object and base URI violations
    if (directive.includes('object-src') || directive.includes('base-uri')) {
      return 'high';
    }

    // Medium severity: Network requests
    if (directive.includes('connect-src') || directive.includes('frame-src')) {
      return 'medium';
    }

    // Medium severity: Resource loading
    if (directive.includes('img-src') || directive.includes('media-src') || directive.includes('font-src')) {
      return 'medium';
    }

    // Low severity: Styles
    return 'low';
  }

  /**
   * Categorize violation type
   */
  private categorizeViolation(directive: string, blockedUri: string): string {
    if (directive.includes('script-src')) return 'script-execution';
    if (directive.includes('style-src')) return 'style-loading';
    if (directive.includes('img-src')) return 'image-loading';
    if (directive.includes('connect-src')) return 'network-request';
    if (directive.includes('font-src')) return 'font-loading';
    if (directive.includes('media-src')) return 'media-loading';
    if (directive.includes('frame-src')) return 'frame-loading';
    if (directive.includes('object-src')) return 'object-loading';
    if (directive.includes('base-uri')) return 'base-uri';
    return 'other';
  }

  /**
   * Set up periodic reporting (for analytics/monitoring)
   */
  private setupPeriodicReporting(): void {
    setInterval(() => {
      if (this.violationReports.length > 0) {
        const summary = this.generateViolationSummary();
        logger.security.info('CSP Violation Summary:', summary);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Generate violation summary
   */
  private generateViolationSummary(): {
    totalViolations: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
    recentViolations: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const bySeverity: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let recentViolations = 0;

    this.violationReports.forEach(violation => {
      // Count by severity
      bySeverity[violation.severity] = (bySeverity[violation.severity] || 0) + 1;
      
      // Count by category
      byCategory[violation.category] = (byCategory[violation.category] || 0) + 1;
      
      // Count recent violations
      if (new Date(violation.timestamp) > oneHourAgo) {
        recentViolations++;
      }
    });

    return {
      totalViolations: this.violationReports.length,
      bySeverity,
      byCategory,
      recentViolations
    };
  }

  /**
   * Get all violation reports
   */
  getViolationReports(): CSPViolationReport[] {
    return [...this.violationReports];
  }

  /**
   * Get recent violations (last hour)
   */
  getRecentViolations(): CSPViolationReport[] {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.violationReports.filter(v => new Date(v.timestamp) > oneHourAgo);
  }

  /**
   * Clear all violation reports
   */
  clearReports(): void {
    this.violationReports = [];
    localStorage.removeItem('csp_violations');
    logger.security.info('CSP violation reports cleared');
  }

  /**
   * Export violation reports
   */
  exportReports(): string {
    return JSON.stringify(this.violationReports, null, 2);
  }

  /**
   * Get violation statistics
   */
  getStatistics(): {
    totalViolations: number;
    highSeverityViolations: number;
    mostCommonViolationType: string;
    violationRate: number; // violations per hour
  } {
    const total = this.violationReports.length;
    const highSeverity = this.violationReports.filter(v => v.severity === 'high').length;
    
    // Find most common violation type
    const categoryCount: Record<string, number> = {};
    this.violationReports.forEach(v => {
      categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
    });
    
    const mostCommonViolationType = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'none'
    );

    // Calculate violation rate (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentViolations = this.violationReports.filter(v => new Date(v.timestamp) > oneDayAgo).length;
    const violationRate = recentViolations / 24; // per hour

    return {
      totalViolations: total,
      highSeverityViolations: highSeverity,
      mostCommonViolationType,
      violationRate
    };
  }
}

// Export singleton instance
export const alternativeCSPReportingService = AlternativeCSPReportingService.getInstance();