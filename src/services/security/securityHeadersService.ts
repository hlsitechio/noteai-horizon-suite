/**
 * Main Security Headers Service
 * Orchestrates all security header services
 */

import { SecurityHeadersConfig, SecurityScore, CSPViolation } from './types';
import { CSPService } from './cspService';
import { HSTSService } from './hstsService';
import { PermissionsPolicyService } from './permissionsPolicyService';

export class SecurityHeadersService {
  private config: SecurityHeadersConfig;
  private cspService: CSPService;
  private hstsService: HSTSService;
  private permissionsPolicyService: PermissionsPolicyService;

  constructor() {
    this.config = {
      csp: {
        enabled: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': [
            "'self'",
            "'unsafe-inline'", // Required for some React functionality
            'https://ubxtmbgvibtjtjggjnjm.supabase.co',
            'https://js.stripe.com',
            'https://www.google.com',
            'https://www.gstatic.com'
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'", // Required for styled-components and Tailwind
            'https://fonts.googleapis.com'
          ],
          'font-src': [
            "'self'",
            'https://fonts.gstatic.com',
            'data:'
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://*.supabase.co',
            'https://*.githubusercontent.com',
            'https://images.unsplash.com'
          ],
          'connect-src': [
            "'self'",
            'https://ubxtmbgvibtjtjggjnjm.supabase.co',
            'wss://ubxtmbgvibtjtjggjnjm.supabase.co',
            'https://api.openai.com',
            'https://api.stripe.com'
          ],
          'frame-src': [
            "'self'",
            'https://js.stripe.com',
            'https://www.google.com'
          ],
          'worker-src': [
            "'self'",
            'blob:'
          ],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
          'frame-ancestors': ["'none'"],
          'upgrade-insecure-requests': []
        },
        reportUri: '/api/csp-report'
      },
      hsts: {
        enabled: true,
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      },
      frameOptions: 'DENY',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: ["'self'"],
        notifications: ["'self'"],
        payment: ["'self'"],
        fullscreen: ["'self'"],
        // Removed deprecated features: vr, ambient-light-sensor, battery
        // These were causing "Unrecognized feature" console warnings
      }
    };

    this.cspService = new CSPService(this.config.csp);
    this.hstsService = new HSTSService(this.config.hsts);
    this.permissionsPolicyService = new PermissionsPolicyService(this.config.permissionsPolicy);
  }

  generateCSPHeader(): string {
    return this.cspService.generateCSPHeader();
  }

  generateHSTSHeader(): string {
    return this.hstsService.generateHSTSHeader();
  }

  generatePermissionsPolicyHeader(): string {
    return this.permissionsPolicyService.generatePermissionsPolicyHeader();
  }

  getAllSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    // Content Security Policy
    const csp = this.generateCSPHeader();
    if (csp) {
      const headerName = this.cspService.getHeaderName();
      headers[headerName] = csp;
    }

    // HTTP Strict Transport Security
    const hsts = this.generateHSTSHeader();
    if (hsts) {
      headers['Strict-Transport-Security'] = hsts;
    }

    // X-Frame-Options
    headers['X-Frame-Options'] = this.config.frameOptions;

    // X-Content-Type-Options
    if (this.config.contentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    // Referrer Policy
    headers['Referrer-Policy'] = this.config.referrerPolicy;

    // Permissions Policy
    const permissionsPolicy = this.generatePermissionsPolicyHeader();
    if (permissionsPolicy) {
      headers['Permissions-Policy'] = permissionsPolicy;
    }

    // Additional security headers
    headers['X-XSS-Protection'] = '1; mode=block';
    headers['X-DNS-Prefetch-Control'] = 'off';
    headers['X-Download-Options'] = 'noopen';
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';

    return headers;
  }

  validateCSP(url: string, resourceType: string): boolean {
    return this.cspService.validateCSP(url, resourceType);
  }

  reportCSPViolation(violation: CSPViolation): void {
    this.cspService.reportCSPViolation(violation);
  }

  updateCSPDirective(directive: string, sources: string[]): void {
    this.cspService.updateCSPDirective(directive, sources);
  }

  enableReportOnlyMode(): void {
    this.cspService.enableReportOnlyMode();
  }

  disableReportOnlyMode(): void {
    this.cspService.disableReportOnlyMode();
  }

  getSecurityScore(): SecurityScore {
    let score = 0;
    const recommendations: string[] = [];

    // CSP Score (40 points)
    const cspScore = this.cspService.getCSPScore();
    score += cspScore;
    if (cspScore === 0) {
      recommendations.push('Enable Content Security Policy');
    }

    // HSTS Score (20 points)
    const hstsScore = this.hstsService.getHSTSScore();
    score += hstsScore;
    if (hstsScore === 0) {
      recommendations.push('Enable HTTP Strict Transport Security');
    } else if (hstsScore < 20) {
      recommendations.push('Consider using HSTS with includeSubDomains and preload');
    }

    // Frame Options (15 points)
    if (this.config.frameOptions === 'DENY') {
      score += 15;
    } else if (this.config.frameOptions === 'SAMEORIGIN') {
      score += 10;
      recommendations.push('Consider using DENY for X-Frame-Options');
    }

    // Content Type Options (10 points)
    if (this.config.contentTypeOptions) {
      score += 10;
    } else {
      recommendations.push('Enable X-Content-Type-Options');
    }

    // Permissions Policy (15 points)
    const permissionsPolicyScore = this.permissionsPolicyService.getPermissionsPolicyScore();
    score += permissionsPolicyScore;
    if (permissionsPolicyScore === 0) {
      recommendations.push('Implement Permissions Policy');
    }

    return { score, recommendations };
  }
}