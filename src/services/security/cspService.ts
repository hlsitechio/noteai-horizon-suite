/**
 * Content Security Policy Service
 */

import { CSPConfig, CSPViolation } from './types';
import { isSameOrigin, matchesWildcard, getCSPDirectiveForResource } from './utils';

export class CSPService {
  private config: CSPConfig;

  constructor(config: CSPConfig) {
    this.config = config;
  }

  generateCSPHeader(): string {
    if (!this.config.enabled) return '';

    const directives = Object.entries(this.config.directives)
      .map(([directive, values]) => {
        if (Array.isArray(values)) {
          return values.length > 0 ? `${directive} ${values.join(' ')}` : directive;
        }
        return `${directive} ${values}`;
      })
      .join('; ');

    let csp = directives;
    
    if (this.config.reportUri) {
      csp += `; report-uri ${this.config.reportUri}`;
    }

    return csp;
  }

  validateCSP(url: string, resourceType: string): boolean {
    // Simplified CSP validation
    const directive = getCSPDirectiveForResource(resourceType);
    const allowedSources = this.config.directives[directive];
    
    if (!Array.isArray(allowedSources)) return true;

    // Check if URL matches any allowed source
    return allowedSources.some(source => {
      if (source === "'self'") {
        return isSameOrigin(url);
      }
      if (source === "'none'") {
        return false;
      }
      if (source.startsWith('https://')) {
        return url.startsWith(source) || matchesWildcard(url, source);
      }
      return false;
    });
  }

  reportCSPViolation(violation: CSPViolation): void {
    // Log CSP violation
    console.warn('CSP Violation Detected:', {
      documentUri: violation.documentUri,
      violatedDirective: violation.violatedDirective,
      blockedUri: violation.blockedUri,
      sourceFile: violation.sourceFile,
      lineNumber: violation.lineNumber,
      timestamp: new Date().toISOString()
    });

    // In production, send to monitoring service
    if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
      const data = JSON.stringify(violation);
      window.navigator.sendBeacon('/api/csp-report', data);
    }
  }

  updateCSPDirective(directive: string, sources: string[]): void {
    this.config.directives[directive] = sources;
  }

  enableReportOnlyMode(): void {
    this.config.reportOnly = true;
  }

  disableReportOnlyMode(): void {
    this.config.reportOnly = false;
  }

  getCSPScore(): number {
    let score = 0;
    
    if (this.config.enabled) {
      score += 30;
      if (this.config.directives['object-src']?.includes("'none'")) score += 5;
      if (this.config.directives['base-uri']?.includes("'self'")) score += 5;
    }
    
    return score;
  }

  getHeaderName(): string {
    return this.config.reportOnly 
      ? 'Content-Security-Policy-Report-Only' 
      : 'Content-Security-Policy';
  }
}