/**
 * Security Audit Utility
 * Comprehensive security measures to prevent information leaks
 */

import { safeLog } from './safeLogger';

export interface SecurityAuditConfig {
  enableConsoleBlocking: boolean;
  enableSensitiveDataMasking: boolean;
  logSecurityViolations: boolean;
  productionMode: boolean;
  aggressiveBlocking: boolean; // NEW: Blocks all non-essential development logs
  allowedLogPatterns: string[]; // NEW: Only these patterns are allowed to log
}

const defaultConfig: SecurityAuditConfig = {
  enableConsoleBlocking: !import.meta.env.DEV,
  enableSensitiveDataMasking: true,
  logSecurityViolations: false, // Reduce noise - only critical security issues
  productionMode: !import.meta.env.DEV,
  aggressiveBlocking: true, // Block most development logs by default
  allowedLogPatterns: [
    'ERROR', 'CRITICAL', 'SECURITY', // Only critical logs allowed
    'Retrieved settings (sanitized)', // Exception for sanitized data
    '✅ Service Worker registered successfully' // Essential PWA status
  ]
};

/**
 * Sensitive data patterns that should never be logged
 */
const SENSITIVE_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  userId: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  token: /\b(bearer\s+)?[A-Za-z0-9_-]{20,}\b/gi,
  apiKey: /\b(sk|pk)_[A-Za-z0-9_-]{20,}\b/gi,
  password: /password/gi,
  secret: /secret|api[_\s]?key|token|bearer/gi,
  sessionId: /session[_\s]?id/gi,
  authToken: /auth[_\s]?token/gi
};

/**
 * Mask sensitive data in strings
 */
export const maskSensitiveData = (data: any): any => {
  if (typeof data === 'string') {
    let masked = data;
    
    // Mask emails
    masked = masked.replace(SENSITIVE_PATTERNS.email, (match) => {
      const parts = match.split('@');
      if (parts.length === 2) {
        const local = parts[0];
        const domain = parts[1];
        return `${local.substring(0, 2)}***@${domain}`;
      }
      return '***@***.***';
    });
    
    // Mask UUIDs
    masked = masked.replace(SENSITIVE_PATTERNS.userId, (match) => {
      return match.substring(0, 8) + '***';
    });
    
    // Mask tokens
    masked = masked.replace(SENSITIVE_PATTERNS.token, () => '***TOKEN***');
    masked = masked.replace(SENSITIVE_PATTERNS.apiKey, () => '***KEY***');
    
    return masked;
  }
  
  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Check if key contains sensitive field names
      const keyLower = key.toLowerCase();
      const isSensitiveKey = keyLower.includes('password') || 
                            keyLower.includes('secret') || 
                            keyLower.includes('token') || 
                            keyLower.includes('apikey') ||
                            keyLower.includes('userid') ||
                            keyLower.includes('email');
      
      if (isSensitiveKey) {
        if (keyLower.includes('email') && typeof value === 'string') {
          // Mask email specifically
          const emailParts = value.split('@');
          if (emailParts.length === 2) {
            masked[key] = `${emailParts[0].substring(0, 2)}***@${emailParts[1]}`;
          } else {
            masked[key] = '***@***.***';
          }
        } else if (keyLower.includes('userid') && typeof value === 'string') {
          // Mask UUID
          masked[key] = value.substring(0, 8) + '***';
        } else {
          masked[key] = '***MASKED***';
        }
      } else {
        masked[key] = maskSensitiveData(value);
      }
    }
    
    return masked;
  }
  
  return data;
};

/**
 * Security audit logger - only logs security violations
 */
export const securityAudit = {
  reportViolation: (violation: string, context?: any) => {
    if (defaultConfig.logSecurityViolations) {
      safeLog.warn(`[SECURITY] ${violation}`, context ? maskSensitiveData(context) : undefined);
    }
  },
  
  reportDataLeak: (source: string, leakedData: any) => {
    securityAudit.reportViolation(`Potential data leak detected in ${source}`, {
      source,
      dataType: typeof leakedData,
      dataPreview: JSON.stringify(maskSensitiveData(leakedData)).substring(0, 100)
    });
  }
};

/**
 * Console wrapper that prevents sensitive data logging in production
 */
class SecureConsole {
  private originalConsole: Console;
  
  constructor() {
    this.originalConsole = { ...console };
  }
  
  private shouldBlock(message?: string): boolean {
    // Block in production
    if (defaultConfig.productionMode && defaultConfig.enableConsoleBlocking) {
      return true;
    }
    
    // In development, use aggressive blocking
    if (defaultConfig.aggressiveBlocking && message) {
      // Check if message contains allowed patterns
      const isAllowed = defaultConfig.allowedLogPatterns.some(pattern => 
        message.includes(pattern)
      );
      
      // Block if not explicitly allowed
      if (!isAllowed) {
        return true;
      }
    }
    
    return false;
  }
  
  private sanitizeArgs(args: any[]): any[] {
    if (!defaultConfig.enableSensitiveDataMasking) {
      return args;
    }
    
    return args.map(arg => {
      if (typeof arg === 'string' || typeof arg === 'object') {
        return maskSensitiveData(arg);
      }
      return arg;
    });
  }
  
  private shouldLogArgs(...args: any[]): boolean {
    const message = args.join(' ');
    return !this.shouldBlock(message);
  }
  
  log(...args: any[]) {
    if (!this.shouldLogArgs(...args)) return;
    this.originalConsole.log(...this.sanitizeArgs(args));
  }
  
  info(...args: any[]) {
    if (!this.shouldLogArgs(...args)) return;
    this.originalConsole.info(...this.sanitizeArgs(args));
  }
  
  warn(...args: any[]) {
    if (!this.shouldLogArgs(...args)) return;
    this.originalConsole.warn(...this.sanitizeArgs(args));
  }
  
  error(...args: any[]) {
    // Always allow errors through but sanitize them
    this.originalConsole.error(...this.sanitizeArgs(args));
  }
  
  debug(...args: any[]) {
    if (!this.shouldLogArgs(...args)) return;
    this.originalConsole.debug(...this.sanitizeArgs(args));
  }
  
  restore() {
    Object.assign(console, this.originalConsole);
  }
}

/**
 * Initialize security measures
 */
export const initializeSecurity = (config: Partial<SecurityAuditConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  Object.assign(defaultConfig, finalConfig);
  
  // Replace console in both production AND development for aggressive blocking
  if (finalConfig.enableConsoleBlocking || finalConfig.aggressiveBlocking) {
    const secureConsole = new SecureConsole();
    
    // Replace console methods
    console.log = secureConsole.log.bind(secureConsole);
    console.info = secureConsole.info.bind(secureConsole);
    console.warn = secureConsole.warn.bind(secureConsole);
    console.error = secureConsole.error.bind(secureConsole);
    console.debug = secureConsole.debug.bind(secureConsole);
    
    // Store restore function globally for debugging if needed
    (window as any).__restoreConsole = secureConsole.restore.bind(secureConsole);
  }
  
  safeLog.info('🔒 SECURITY AUDIT ACTIVE - Aggressive log blocking enabled', { 
    mode: finalConfig.productionMode ? 'production' : 'development',
    consoleBlocking: finalConfig.enableConsoleBlocking,
    aggressiveBlocking: finalConfig.aggressiveBlocking,
    dataMasking: finalConfig.enableSensitiveDataMasking
  });
};

/**
 * Middleware function to sanitize API responses
 */
export const sanitizeApiResponse = (response: any): any => {
  if (defaultConfig.enableSensitiveDataMasking) {
    return maskSensitiveData(response);
  }
  return response;
};

/**
 * Check if a string contains sensitive information
 */
export const containsSensitiveData = (data: string): boolean => {
  return Object.values(SENSITIVE_PATTERNS).some(pattern => pattern.test(data));
};