/**
 * Security Headers Service
 * Implements Content Security Policy, HSTS, and other security headers
 */

interface SecurityHeadersConfig {
  csp: {
    enabled: boolean;
    directives: Record<string, string | string[]>;
    reportUri?: string;
    reportOnly?: boolean;
  };
  hsts: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  contentTypeOptions: boolean;
  referrerPolicy: string;
  permissionsPolicy: Record<string, string[]>;
}

class SecurityHeadersService {
  private config: SecurityHeadersConfig = {
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
      fullscreen: ["'self'"]
    }
  };

  generateCSPHeader(): string {
    if (!this.config.csp.enabled) return '';

    const directives = Object.entries(this.config.csp.directives)
      .map(([directive, values]) => {
        if (Array.isArray(values)) {
          return values.length > 0 ? `${directive} ${values.join(' ')}` : directive;
        }
        return `${directive} ${values}`;
      })
      .join('; ');

    let csp = directives;
    
    if (this.config.csp.reportUri) {
      csp += `; report-uri ${this.config.csp.reportUri}`;
    }

    return csp;
  }

  generateHSTSHeader(): string {
    if (!this.config.hsts.enabled) return '';

    let hsts = `max-age=${this.config.hsts.maxAge}`;
    
    if (this.config.hsts.includeSubDomains) {
      hsts += '; includeSubDomains';
    }
    
    if (this.config.hsts.preload) {
      hsts += '; preload';
    }

    return hsts;
  }

  generatePermissionsPolicyHeader(): string {
    const policies = Object.entries(this.config.permissionsPolicy)
      .map(([feature, allowList]) => {
        if (allowList.length === 0) {
          return `${feature}=()`;
        }
        return `${feature}=(${allowList.join(' ')})`;
      })
      .join(', ');

    return policies;
  }

  getAllSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    // Content Security Policy
    const csp = this.generateCSPHeader();
    if (csp) {
      const headerName = this.config.csp.reportOnly 
        ? 'Content-Security-Policy-Report-Only' 
        : 'Content-Security-Policy';
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
    // Simplified CSP validation
    const directive = this.getCSPDirectiveForResource(resourceType);
    const allowedSources = this.config.csp.directives[directive];
    
    if (!Array.isArray(allowedSources)) return true;

    // Check if URL matches any allowed source
    return allowedSources.some(source => {
      if (source === "'self'") {
        return this.isSameOrigin(url);
      }
      if (source === "'none'") {
        return false;
      }
      if (source.startsWith('https://')) {
        return url.startsWith(source) || this.matchesWildcard(url, source);
      }
      return false;
    });
  }

  reportCSPViolation(violation: {
    documentUri: string;
    violatedDirective: string;
    blockedUri: string;
    sourceFile?: string;
    lineNumber?: number;
  }): void {
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
    this.config.csp.directives[directive] = sources;
  }

  enableReportOnlyMode(): void {
    this.config.csp.reportOnly = true;
  }

  disableReportOnlyMode(): void {
    this.config.csp.reportOnly = false;
  }

  getSecurityScore(): {
    score: number;
    recommendations: string[];
  } {
    let score = 0;
    const recommendations: string[] = [];

    // CSP Score (40 points)
    if (this.config.csp.enabled) {
      score += 30;
      if (this.config.csp.directives['object-src']?.includes("'none'")) score += 5;
      if (this.config.csp.directives['base-uri']?.includes("'self'")) score += 5;
    } else {
      recommendations.push('Enable Content Security Policy');
    }

    // HSTS Score (20 points)
    if (this.config.hsts.enabled) {
      score += 15;
      if (this.config.hsts.includeSubDomains) score += 3;
      if (this.config.hsts.preload) score += 2;
    } else {
      recommendations.push('Enable HTTP Strict Transport Security');
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
    if (Object.keys(this.config.permissionsPolicy).length > 0) {
      score += 15;
    } else {
      recommendations.push('Implement Permissions Policy');
    }

    return { score, recommendations };
  }

  private getCSPDirectiveForResource(resourceType: string): string {
    const mapping: Record<string, string> = {
      script: 'script-src',
      style: 'style-src',
      image: 'img-src',
      font: 'font-src',
      connect: 'connect-src',
      frame: 'frame-src',
      worker: 'worker-src',
      object: 'object-src'
    };

    return mapping[resourceType] || 'default-src';
  }

  private isSameOrigin(url: string): boolean {
    if (typeof window === 'undefined') return true;
    
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private matchesWildcard(url: string, pattern: string): boolean {
    // Simple wildcard matching for CSP sources
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      return new RegExp(`^${regexPattern}$`).test(url);
    }
    return url.startsWith(pattern);
  }
}

export const securityHeadersService = new SecurityHeadersService();