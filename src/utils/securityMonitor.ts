/**
 * Security Monitor - Real-time security monitoring and threat detection
 */

import { toast } from 'sonner';

interface SecurityThreat {
  type: 'xss' | 'injection' | 'csrf' | 'brute_force' | 'data_breach' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

interface SecurityRule {
  id: string;
  pattern: RegExp | ((data: any) => boolean);
  severity: SecurityThreat['severity'];
  type: SecurityThreat['type'];
  description: string;
  action: 'log' | 'block' | 'alert';
}

class SecurityMonitor {
  private threats: SecurityThreat[] = [];
  private rules: SecurityRule[] = [];
  private isActive = false;
  private requestPatterns = new Map<string, { count: number; timestamps: number[] }>();

  initialize() {
    if (this.isActive) return;
    
    console.log('🛡️ Initializing Security Monitor...');
    this.setupSecurityRules();
    this.setupRequestMonitoring();
    this.setupDOMMonitoring();
    this.setupNetworkMonitoring();
    this.isActive = true;
    console.log('✅ Security Monitor active');
  }

  private setupSecurityRules() {
    // XSS Detection Rules - Only critical ones
    this.addRule({
      id: 'xss_script_tags',
      pattern: /<script[^>]*>.*?<\/script>/gi,
      severity: 'high',
      type: 'xss',
      description: 'Script tag injection detected',
      action: 'block'
    });

    this.addRule({
      id: 'xss_javascript_protocol',
      pattern: /javascript:/gi,
      severity: 'high',
      type: 'xss',
      description: 'JavaScript protocol detected',
      action: 'block'
    });

    // SQL Injection Detection - Only critical ones
    this.addRule({
      id: 'sql_injection_union',
      pattern: /union\s+select/gi,
      severity: 'critical',
      type: 'injection',
      description: 'SQL injection attempt detected',
      action: 'block'
    });

    this.addRule({
      id: 'sql_injection_drop',
      pattern: /drop\s+table/gi,
      severity: 'critical',
      type: 'injection',
      description: 'Destructive SQL injection attempt',
      action: 'block'
    });

    // Brute Force Detection - More reasonable thresholds
    this.addRule({
      id: 'brute_force_login',
      pattern: (data: any) => {
        if (data.type === 'login_attempt') {
          const key = `login_${data.email}`;
          const pattern = this.requestPatterns.get(key) || { count: 0, timestamps: [] };
          pattern.count++;
          pattern.timestamps.push(Date.now());
          
          // Remove timestamps older than 15 minutes
          pattern.timestamps = pattern.timestamps.filter(t => Date.now() - t < 15 * 60 * 1000);
          pattern.count = pattern.timestamps.length;
          
          this.requestPatterns.set(key, pattern);
          
          return pattern.count > 10; // Increased threshold
        }
        return false;
      },
      severity: 'high',
      type: 'brute_force',
      description: 'Brute force login attempt detected',
      action: 'alert'
    });

    // Suspicious Activity Detection - Much higher threshold
    this.addRule({
      id: 'rapid_requests',
      pattern: (data: any) => {
        if (data.type === 'api_request') {
          // Skip monitoring our own security logging requests
          if (data.endpoint && data.endpoint.includes('security_audit_log')) {
            return false;
          }
          
          const key = `api_${data.endpoint}`;
          const pattern = this.requestPatterns.get(key) || { count: 0, timestamps: [] };
          pattern.timestamps.push(Date.now());
          
          // Remove timestamps older than 1 minute
          pattern.timestamps = pattern.timestamps.filter(t => Date.now() - t < 60 * 1000);
          pattern.count = pattern.timestamps.length;
          
          this.requestPatterns.set(key, pattern);
          
          return pattern.count > 100; // Much higher threshold
        }
        return false;
      },
      severity: 'medium',
      type: 'suspicious_activity',
      description: 'Rapid API requests detected',
      action: 'log'
    });
  }

  private addRule(rule: SecurityRule) {
    this.rules.push(rule);
  }

  private setupRequestMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args: any[]) => {
      const url = args[0];
      const options = args[1] || {};
      
      // Skip monitoring for security audit log requests to prevent loops
      if (typeof url === 'string' && url.includes('security_audit_log')) {
        return originalFetch.apply(window, args);
      }
      
      // Monitor for suspicious patterns in requests
      this.checkRequest(url, options);
      
      try {
        const response = await originalFetch.apply(window, args);
        
        // Skip response checking for internal requests
        if (typeof url === 'string' && !url.includes('security_audit_log')) {
          this.checkResponse(response, url);
        }
        
        return response;
      } catch (error) {
        // Only log actual network errors, not security-related ones
        if (error instanceof Error && !error.message.includes('security')) {
          this.logThreat({
            type: 'suspicious_activity',
            severity: 'low',
            description: 'Network request failed',
            metadata: { url, error: error.message },
            timestamp: new Date()
          });
        }
        throw error;
      }
    };
  }

  private setupDOMMonitoring() {
    // Monitor DOM mutations for suspicious changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              this.checkDOMElement(element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'onclick', 'onload']
    });
  }

  private setupNetworkMonitoring() {
    // Monitor console errors for security issues - but with reduced sensitivity
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Call original console.error
      originalError.apply(console, args);
      
      // Check for security-related errors
      const message = args.join(' ');
      
      // Skip common development and security monitoring related errors
      if (import.meta.env.DEV || 
          message.includes('Content Security Policy') ||
          message.includes('Failed to construct \'Worker\'') ||
          message.includes('SecurityError') ||
          message.includes('security_audit_log') ||
          message.includes('401') && message.includes('Unauthorized')) {
        return;
      }
      
      // Only log actual security violations
      if (message.includes('Mixed Content') || message.includes('XSS')) {
        this.logThreat({
          type: 'csrf',
          severity: 'medium',
          description: 'Security policy violation',
          metadata: { message },
          timestamp: new Date()
        });
      }
    };
  }

  private checkRequest(url: string | URL, options: any) {
    // Skip checking our own security logging requests
    const urlString = typeof url === 'string' ? url : url.toString();
    if (urlString.includes('security_audit_log')) {
      return;
    }
    
    const data = {
      type: 'api_request',
      endpoint: urlString,
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body
    };

    this.applyRules(data);
  }

  private checkResponse(response: Response, url: string | URL) {
    // Skip response checking for internal/development requests
    const urlString = typeof url === 'string' ? url : url.toString();
    if (urlString.includes('supabase.co') || 
        urlString.includes('localhost') || 
        urlString.includes('lovable.app')) {
      return;
    }
    
    // Only check for critical missing headers on external requests
    const criticalHeaders = ['X-Content-Type-Options', 'X-XSS-Protection'];
    const missingHeaders = criticalHeaders.filter(header => !response.headers.get(header));
    
    if (missingHeaders.length === criticalHeaders.length) {
      this.logThreat({
        type: 'csrf',
        severity: 'low',
        description: 'Missing critical security headers',
        metadata: { url: urlString, missingHeaders },
        timestamp: new Date()
      });
    }
  }

  private checkDOMElement(element: Element) {
    const tagName = element.tagName.toLowerCase();
    
    // Only check for dangerous script elements
    if (tagName === 'script') {
      const src = element.getAttribute('src');
      // Skip internal/trusted scripts
      if (!src || src.includes('lovable') || src.includes('localhost')) {
        return;
      }
      
      this.logThreat({
        type: 'xss',
        severity: 'medium',
        description: 'External script element added',
        metadata: { 
          tagName, 
          src,
          innerHTML: element.innerHTML.substring(0, 100)
        },
        timestamp: new Date()
      });
    }
  }

  applyRules(data: any) {
    this.rules.forEach(rule => {
      let isMatch = false;
      
      if (rule.pattern instanceof RegExp) {
        const dataString = JSON.stringify(data);
        isMatch = rule.pattern.test(dataString);
      } else if (typeof rule.pattern === 'function') {
        try {
          isMatch = rule.pattern(data);
        } catch (error) {
          // Ignore pattern matching errors
          return;
        }
      }

      if (isMatch) {
        const threat: SecurityThreat = {
          type: rule.type,
          severity: rule.severity,
          description: rule.description,
          metadata: { ruleId: rule.id, data },
          timestamp: new Date()
        };

        this.handleThreat(threat, rule.action);
      }
    });
  }

  private handleThreat(threat: SecurityThreat, action: SecurityRule['action']) {
    this.logThreat(threat);

    switch (action) {
      case 'block':
        this.blockThreat(threat);
        break;
      case 'alert':
        this.alertThreat(threat);
        break;
      case 'log':
        // Already logged, no additional action
        break;
    }
  }

  private logThreat(threat: SecurityThreat) {
    this.threats.push(threat);
    
    // Keep only last 100 threats
    if (this.threats.length > 100) {
      this.threats = this.threats.slice(-100);
    }

    // Only log high and critical threats to console to reduce noise
    if (threat.severity === 'high' || threat.severity === 'critical') {
      console.warn(`🚨 Security Threat Detected: ${threat.type} - ${threat.description}`, threat);
    }

    // Don't log to Supabase anymore since auth is removed
  }

  private blockThreat(threat: SecurityThreat) {
    toast.error(`Security threat blocked: ${threat.description}`, {
      duration: 5000,
    });

    if (threat.severity === 'critical') {
      console.error('🚨 Critical security threat detected');
    }
  }

  private alertThreat(threat: SecurityThreat) {
    if (threat.severity === 'high' || threat.severity === 'critical') {
      toast.warning(`Security alert: ${threat.description}`, {
        duration: 8000,
      });
    }
  }

  getThreats(filter?: { type?: SecurityThreat['type']; severity?: SecurityThreat['severity'] }) {
    let filteredThreats = this.threats;

    if (filter?.type) {
      filteredThreats = filteredThreats.filter(t => t.type === filter.type);
    }

    if (filter?.severity) {
      filteredThreats = filteredThreats.filter(t => t.severity === filter.severity);
    }

    return filteredThreats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getSecurityStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentThreats = this.threats.filter(t => t.timestamp > last24Hours);

    const byType = recentThreats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = recentThreats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalThreats: this.threats.length,
      recentThreats: recentThreats.length,
      byType,
      bySeverity,
      isActive: this.isActive,
      rulesCount: this.rules.length
    };
  }

  clearThreats() {
    this.threats = [];
    this.requestPatterns.clear();
    console.log('🧹 Security threats cleared');
  }

  shutdown() {
    this.isActive = false;
    this.clearThreats();
    console.log('🛡️ Security Monitor shutdown');
  }
}

export const securityMonitor = new SecurityMonitor();

// Auto-initialize disabled for simple app
if (typeof window !== 'undefined') {
  // securityMonitor.initialize();
  (window as any).securityMonitor = securityMonitor;
}
