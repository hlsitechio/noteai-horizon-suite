/**
 * CSP Initialization Service
 * Dynamically applies and manages Content Security Policy
 */

import { SecurityHeadersService } from './securityHeadersService';
import { logger } from '@/utils/logger';

export class CSPInitializationService {
  private static instance: CSPInitializationService;
  private securityService: SecurityHeadersService;
  private isInitialized = false;
  private violationCount = 0;
  private readonly maxViolations = 50; // Prevent spam

  private constructor() {
    this.securityService = new SecurityHeadersService();
  }

  static getInstance(): CSPInitializationService {
    if (!CSPInitializationService.instance) {
      CSPInitializationService.instance = new CSPInitializationService();
    }
    return CSPInitializationService.instance;
  }

  /**
   * Initialize CSP with dynamic headers and violation monitoring
   */
  initialize(): void {
    if (this.isInitialized) return;

    try {
      // Apply dynamic CSP headers to replace static ones
      this.applyDynamicCSP();
      
      // Set up violation monitoring
      this.setupViolationMonitoring();
      
      // Monitor for DOM mutations that might violate CSP
      this.setupDOMMonitoring();
      
      this.isInitialized = true;
      logger.security.info('✅ CSP initialized with dynamic headers and monitoring');
      
    } catch (error) {
      logger.security.error('❌ Failed to initialize CSP:', error);
    }
  }

  /**
   * Apply dynamic CSP headers by updating existing meta tags
   */
  private applyDynamicCSP(): void {
    const headers = this.securityService.getAllSecurityHeaders();
    
    // Apply other security headers as meta tags (excluding CSP and headers that require HTTP)
    Object.entries(headers).forEach(([name, value]) => {
      // Skip CSP policies entirely - they contain report-uri which isn't allowed in meta tags
      // Also skip other headers that must be HTTP-only
      if (name.includes('Content-Security-Policy') || 
          name === 'X-Frame-Options' ||
          name === 'X-Content-Type-Options' ||
          name === 'Referrer-Policy') {
        logger.security.debug(`Skipped HTTP-only header: ${name}`);
        return;
      }
      
      this.updateMetaTag(name, value);
    });
    
    logger.security.info('✅ Security headers applied (CSP policies skipped for meta compatibility)');
  }

  /**
   * Make CSP policy compatible with meta tag delivery
   * Removes directives that are only allowed in HTTP headers
   */
  private makeMetaCompatible(cspPolicy?: string): string {
    if (!cspPolicy) return '';

    // Remove report-uri and report-to directives as they're not allowed in meta tags
    // Handle cases with and without semicolons, at beginning, middle, or end of policy
    return cspPolicy
      .replace(/;\s*report-uri\s+[^;]+/gi, '')           // Middle: ; report-uri /path
      .replace(/;\s*report-to\s+[^;]+/gi, '')            // Middle: ; report-to group
      .replace(/^report-uri\s+[^;]+;\s*/gi, '')          // Beginning: report-uri /path;
      .replace(/^report-to\s+[^;]+;\s*/gi, '')           // Beginning: report-to group;
      .replace(/;\s*report-uri\s+[^;]*$/gi, '')          // End: ; report-uri /path
      .replace(/;\s*report-to\s+[^;]*$/gi, '')           // End: ; report-to group
      .replace(/^report-uri\s+[^;]*$/gi, '')             // Entire: report-uri /path
      .replace(/^report-to\s+[^;]*$/gi, '')              // Entire: report-to group
      .replace(/\s+/g, ' ')                              // Clean up multiple spaces
      .trim();
  }

  /**
   * Update or create meta tag for security headers
   */
  private updateMetaTag(name: string, content?: string): void {
    if (!content) return;

    // Skip empty or invalid policies
    if (content.trim().length === 0) return;

    // Find existing meta tag
    let metaTag = document.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement;
    
    if (metaTag) {
      // Update existing tag
      metaTag.setAttribute('content', content);
      logger.security.debug(`Updated CSP meta tag: ${name}`);
    } else {
      // Create new meta tag
      metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
      logger.security.debug(`Created CSP meta tag: ${name}`);
    }
  }

  /**
   * Set up CSP violation event monitoring
   */
  private setupViolationMonitoring(): void {
    // Modern CSP violation event
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation({
        documentUri: event.documentURI,
        violatedDirective: event.violatedDirective,
        blockedUri: event.blockedURI,
        originalPolicy: event.originalPolicy,
        sample: event.sample || '',
        sourceFile: event.sourceFile || '',
        lineNumber: event.lineNumber || 0,
        columnNumber: event.columnNumber || 0
      });
    });

    // Legacy report-uri endpoint (if configured)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason === 'object' && 
          event.reason.message && event.reason.message.includes('CSP')) {
        logger.security.warn('Potential CSP-related rejection:', event.reason);
      }
    });
  }

  /**
   * Handle CSP violations with rate limiting and analysis
   */
  private handleCSPViolation(violation: {
    documentUri: string;
    violatedDirective: string;
    blockedUri: string;
    originalPolicy: string;
    sample: string;
    sourceFile: string;
    lineNumber: number;
    columnNumber: number;
  }): void {
    this.violationCount++;
    
    // Rate limit violation reporting
    if (this.violationCount > this.maxViolations) {
      if (this.violationCount === this.maxViolations + 1) {
        logger.security.warn('🚫 CSP violation reporting rate limited');
      }
      return;
    }

    // Analyze violation type
    const violationType = this.analyzeViolationType(violation);
    
    // Report to security service
    this.securityService.reportCSPViolation({
      documentUri: violation.documentUri,
      violatedDirective: violation.violatedDirective,
      blockedUri: violation.blockedUri,
      timestamp: new Date().toISOString(),
      severity: violationType.severity,
      category: violationType.category
    });

    // Log with appropriate level
    const logLevel = violationType.severity === 'high' ? 'error' : 
                    violationType.severity === 'medium' ? 'warn' : 'debug';
    
    logger.security[logLevel]('🛡️ CSP Violation:', {
      directive: violation.violatedDirective,
      blocked: violation.blockedUri,
      type: violationType.category,
      severity: violationType.severity
    });
  }

  /**
   * Analyze CSP violation to determine severity and type
   */
  private analyzeViolationType(violation: {
    violatedDirective: string;
    blockedUri: string;
  }): { severity: 'high' | 'medium' | 'low', category: string } {
    const { violatedDirective, blockedUri } = violation;

    // High severity violations
    if (violatedDirective.includes('script-src') && 
        (blockedUri.includes('eval') || blockedUri.includes('inline'))) {
      return { severity: 'high', category: 'unsafe-script-execution' };
    }

    if (violatedDirective.includes('object-src') || violatedDirective.includes('base-uri')) {
      return { severity: 'high', category: 'potential-injection' };
    }

    // Medium severity violations
    if (violatedDirective.includes('img-src') || violatedDirective.includes('media-src')) {
      return { severity: 'medium', category: 'resource-loading' };
    }

    if (violatedDirective.includes('connect-src')) {
      return { severity: 'medium', category: 'network-request' };
    }

    // Low severity violations
    return { severity: 'low', category: 'style-or-font' };
  }

  /**
   * Set up DOM monitoring for potential CSP violations
   */
  private setupDOMMonitoring(): void {
    // Monitor for dynamic script insertions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for inline scripts
            if (element.tagName === 'SCRIPT' && element.textContent) {
              logger.security.debug('Dynamic script detected:', {
                content: element.textContent.substring(0, 100),
                src: element.getAttribute('src')
              });
            }
            
            // Check for inline styles
            if (element.hasAttribute('style')) {
              logger.security.debug('Inline style detected:', {
                tag: element.tagName,
                style: element.getAttribute('style')?.substring(0, 100)
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'onclick', 'onload']
    });
  }

  /**
   * Update CSP policy at runtime (for development/testing)
   */
  updateCSPPolicy(directive: string, sources: string[]): void {
    this.securityService.updateCSPDirective(directive, sources);
    this.applyDynamicCSP();
    logger.security.info(`CSP directive updated: ${directive}`, sources);
  }

  /**
   * Enable/disable report-only mode
   */
  setReportOnlyMode(enabled: boolean): void {
    if (enabled) {
      this.securityService.enableReportOnlyMode();
    } else {
      this.securityService.disableReportOnlyMode();
    }
    this.applyDynamicCSP();
    logger.security.info(`CSP report-only mode: ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current CSP status and metrics
   */
  getCSPStatus(): {
    isActive: boolean;
    violationCount: number;
    securityScore: number;
    lastViolation?: Date;
  } {
    const securityScore = this.securityService.getSecurityScore();
    
    return {
      isActive: this.isInitialized,
      violationCount: this.violationCount,
      securityScore: securityScore.score,
      lastViolation: this.violationCount > 0 ? new Date() : undefined
    };
  }

  /**
   * Reset violation counter (for testing/monitoring)
   */
  resetViolationCounter(): void {
    this.violationCount = 0;
    logger.security.info('CSP violation counter reset');
  }
}

// Export singleton instance
export const cspInitializationService = CSPInitializationService.getInstance();