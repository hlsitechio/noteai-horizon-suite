/**
 * Content Security Policy (CSP) Service - Enhanced Version
 * 2025-07 | For use in Chrome, Edge, Firefox, and Safari (latest)
 */

import type { CSPConfig, CSPViolation } from './types';
import {
  isSameOrigin,
  matchesWildcard,
  getCSPDirectiveForResource
} from './utils';

/**
 * Helper to sanitize directive values to prevent malformed headers.
 */
function sanitizeCSPValue(value: string): string {
  // Remove CRLF, trim spaces, collapse double spaces
  return value.replace(/[\r\n]+/g, '').replace(/\s\s+/g, ' ').trim();
}

/**
 * The main CSP Service class
 */
export class CSPService {
  private config: CSPConfig;

  constructor(config: CSPConfig) {
    this.config = { ...config };
  }

  /**
   * Generates a valid CSP header string.
   * Includes both `report-uri` (legacy) and `report-to` (modern, Chrome/Edge/FF/Safari).
   */
  generateCSPHeader(): string {
    if (!this.config.enabled) return '';

    const parts: string[] = [];
    for (const [directive, values] of Object.entries(this.config.directives)) {
      if (Array.isArray(values) && values.length > 0) {
        parts.push(`${directive} ${values.map(sanitizeCSPValue).join(' ')}`);
      } else if (typeof values === 'string') {
        parts.push(`${directive} ${sanitizeCSPValue(values)}`);
      }
    }

    // Add report-uri (legacy, still used by some tools) and report-to (modern)
    if (this.config.reportUri) {
      parts.push(`report-uri ${sanitizeCSPValue(this.config.reportUri)}`);
    }
    if (this.config.reportTo) {
      parts.push(`report-to ${sanitizeCSPValue(this.config.reportTo)}`);
    }

    // Return the concatenated header
    return parts.join('; ');
  }

  /**
   * Returns the appropriate CSP header name.
   */
  getHeaderName(): string {
    return this.config.reportOnly
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy';
  }

  /**
   * Validates if a URL is allowed by the CSP config for the given resource type.
   */
  validateCSP(url: string, resourceType: string): boolean {
    const directive = getCSPDirectiveForResource(resourceType);
    const allowedSources = this.config.directives[directive];

    if (!allowedSources) return true;
    const arr = Array.isArray(allowedSources)
      ? allowedSources
      : [allowedSources];

    // Browser CSP supports:
    // - 'self', 'none', 'unsafe-inline', 'unsafe-eval', 'strict-dynamic', https:, data:, blob:, filesystem:
    return arr.some(source => {
      if (source === "'self'") return isSameOrigin(url);
      if (source === "'none'") return false;
      if (source === '*') return true; // not recommended
      if (/^https?:\/\//.test(source)) {
        return url.startsWith(source) || matchesWildcard(url, source);
      }
      if (/^(data|blob|filesystem):/.test(source)) {
        return url.startsWith(source);
      }
      // Allow schemes (e.g., data:)
      if (/^[a-z]+:$/.test(source)) {
        return url.startsWith(source);
      }
      return false;
    });
  }

  /**
   * Logs and reports a CSP violation.
   * Uses sendBeacon (async) if available and allowed.
   */
  reportCSPViolation(violation: CSPViolation): void {
    const logData = {
      ...violation,
      timestamp: new Date().toISOString()
    };
    // eslint-disable-next-line no-console
    console.warn('CSP Violation Detected:', logData);

    if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
      try {
        window.navigator.sendBeacon(
          this.config.reportUri || '/api/csp-report',
          JSON.stringify(logData)
        );
      } catch (e) {
        // fallback: POST (if needed)
      }
    }
    // Optionally: Send to a logging service here if needed
  }

  /**
   * Updates a specific CSP directive at runtime (e.g., to tighten or relax policies).
   */
  updateCSPDirective(directive: string, sources: string[] | string): void {
    this.config.directives[directive] = Array.isArray(sources) ? sources : [sources];
  }

  /**
   * Enables CSP report-only mode (does not block, only reports).
   */
  enableReportOnlyMode(): void {
    this.config.reportOnly = true;
  }

  /**
   * Disables CSP report-only mode (blocks violations).
   */
  disableReportOnlyMode(): void {
    this.config.reportOnly = false;
  }

  /**
   * Returns a naive CSP security score (for dashboard/hints).
   */
  getCSPScore(): number {
    let score = 0;
    if (this.config.enabled) {
      score += 30;
      if (
        Array.isArray(this.config.directives['object-src']) &&
        this.config.directives['object-src'].includes("'none'")
      ) score += 10;
      if (
        Array.isArray(this.config.directives['base-uri']) &&
        this.config.directives['base-uri'].includes("'self'")
      ) score += 5;
      if (
        Array.isArray(this.config.directives['script-src']) &&
        !this.config.directives['script-src'].includes("'unsafe-inline'")
      ) score += 10;
      if (
        Array.isArray(this.config.directives['default-src']) &&
        !this.config.directives['default-src'].includes('*')
      ) score += 10;
    }
    return score;
  }

  /**
   * Merge or replace the entire CSP config.
   */
  updateConfig(config: Partial<CSPConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Expose raw config (read-only)
   */
  getConfig(): Readonly<CSPConfig> {
    return { ...this.config };
  }
}

