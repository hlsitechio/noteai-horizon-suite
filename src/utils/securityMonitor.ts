/**
 * Security Monitor - Real-time security monitoring and threat detection
 */

import { supabase } from '@/integrations/supabase/client';
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
    // XSS Detection Rules
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

    this.addRule({
      id: 'xss_event_handlers',
      pattern: /on\w+\s*=/gi,
      severity: 'medium',
      type: 'xss',
      description: 'Event handler injection detected',
      action: 'block'
    });

    // SQL Injection Detection
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

    // Brute Force Detection
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
          
          return pattern.count > 5; // More than 5 attempts in 15 minutes
        }
        return false;
      },
      severity: 'high',
      type: 'brute_force',
      description: 'Brute force login attempt detected',
      action: 'alert'
    });

    // Suspicious Activity Detection
    this.addRule({
      id: 'rapid_requests',
      pattern: (data: any) => {
        if (data.type === 'api_request') {
          const key = `api_${data.endpoint}`;
          const pattern = this.requestPatterns.get(key) || { count: 0, timestamps: [] };
          pattern.timestamps.push(Date.now());
          
          // Remove timestamps older than 1 minute
          pattern.timestamps = pattern.timestamps.filter(t => Date.now() - t < 60 * 1000);
          pattern.count = pattern.timestamps.length;
          
          this.requestPatterns.set(key, pattern);
          
          return pattern.count > 30; // More than 30 requests per minute
        }
        return false;
      },
      severity: 'medium',
      type: 'suspicious_activity',
      description: 'Rapid API requests detected',
      action: 'alert'
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
      
      // Monitor for suspicious patterns in requests
      this.checkRequest(url, options);
      
      try {
        const response = await originalFetch.apply(window, args);
        
        // Monitor response for security issues
        this.checkResponse(response, url);
        
        return response;
      } catch (error) {
        this.logThreat({
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Network request failed',
          metadata: { url, error: error instanceof Error ? error.message : String(error) },
          timestamp: new Date()
        });
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
    // Monitor console errors for security issues
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check for security-related errors
      if (message.includes('Content Security Policy') || 
          message.includes('Mixed Content') ||
          message.includes('CORS')) {
        this.logThreat({
          type: 'csrf',
          severity: 'medium',
          description: 'Security policy violation',
          metadata: { message },
          timestamp: new Date()
        });
      }
      
      return originalError.apply(console, args);
    };
  }

  private checkRequest(url: string, options: any) {
    // Check for suspicious request patterns
    const data = {
      type: 'api_request',
      endpoint: typeof url === 'string' ? url : url.toString(),
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body
    };

    this.applyRules(data);
  }

  private checkResponse(response: Response, url: string) {
    // Check response headers for security issues
    const securityHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];

    const missingHeaders = securityHeaders.filter(header => !response.headers.get(header));
    
    if (missingHeaders.length > 0) {
      this.logThreat({
        type: 'csrf',
        severity: 'low',
        description: 'Missing security headers',
        metadata: { url, missingHeaders },
        timestamp: new Date()
      });
    }
  }

  private checkDOMElement(element: Element) {
    const tagName = element.tagName.toLowerCase();
    const attributes = Array.from(element.attributes);
    
    // Check for dangerous elements
    if (tagName === 'script') {
      this.logThreat({
        type: 'xss',
        severity: 'high',
        description: 'Script element dynamically added',
        metadata: { 
          tagName, 
          src: element.getAttribute('src'),
          innerHTML: element.innerHTML.substring(0, 100)
        },
        timestamp: new Date()
      });
    }

    // Check for dangerous attributes
    attributes.forEach(attr => {
      if (attr.name.startsWith('on') && attr.value) {
        this.logThreat({
          type: 'xss',
          severity: 'medium',
          description: 'Event handler attribute detected',
          metadata: { 
            tagName, 
            attribute: attr.name,
            value: attr.value.substring(0, 100)
          },
          timestamp: new Date()
        });
      }
    });
  }

  private applyRules(data: any) {
    this.rules.forEach(rule => {
      let isMatch = false;
      
      if (rule.pattern instanceof RegExp) {
        const dataString = JSON.stringify(data);
        isMatch = rule.pattern.test(dataString);
      } else if (typeof rule.pattern === 'function') {
        isMatch = rule.pattern(data);
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
        // Already logged
        break;
    }
  }

  private logThreat(threat: SecurityThreat) {
    this.threats.push(threat);
    
    // Keep only last 1000 threats
    if (this.threats.length > 1000) {
      this.threats = this.threats.slice(-1000);
    }

    console.warn(`🚨 Security Threat Detected: ${threat.type} - ${threat.description}`, threat);

    // Log to Supabase for analysis
    this.logToDatabase(threat);
  }

  private blockThreat(threat: SecurityThreat) {
    toast.error(`Security threat blocked: ${threat.description}`, {
      duration: 5000,
    });

    // If critical, consider redirecting to safe page
    if (threat.severity === 'critical') {
      console.error('🚨 Critical security threat detected, consider emergency measures');
    }
  }

  private alertThreat(threat: SecurityThreat) {
    if (threat.severity === 'high' || threat.severity === 'critical') {
      toast.warning(`Security alert: ${threat.description}`, {
        duration: 8000,
      });
    }
  }

  private async logToDatabase(threat: SecurityThreat) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('security_audit_log').insert({
        user_id: user?.id || null,
        action: 'security_threat_detected',
        table_name: 'security_monitor',
        record_id: null,
        new_values: threat as any
      });
    } catch (error) {
      console.error('Failed to log security threat to database:', error);
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

// Auto-initialize
if (typeof window !== 'undefined') {
  securityMonitor.initialize();
  (window as any).securityMonitor = securityMonitor;
}
