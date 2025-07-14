
/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  title: /^[a-zA-Z0-9\s\-_.,!?()[\]{}'"]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
} as const;

// Maximum lengths for different input types
export const MAX_LENGTHS = {
  title: 500,
  content: 10485760, // 10MB
  tag: 50,
  folderName: 255,
  displayName: 100,
} as const;

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on(load|error|click|focus|blur|change|submit)=/gi, '')
    .replace(/<iframe[^>]*src=/gi, '')
    .replace(/<object[^>]*data=/gi, '')
    .replace(/<embed[^>]*src=/gi, '')
    .trim();
};

/**
 * Validate note title
 */
export const validateNoteTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title cannot be empty' };
  }
  
  if (title.length > MAX_LENGTHS.title) {
    return { isValid: false, error: `Title too long (max ${MAX_LENGTHS.title} characters)` };
  }
  
  return { isValid: true };
};

/**
 * Validate note content
 */
export const validateNoteContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content) return { isValid: true }; // Content can be empty
  
  if (content.length > MAX_LENGTHS.content) {
    return { isValid: false, error: 'Content too large (max 10MB)' };
  }
  
  // Check for potentially malicious content
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on(load|error|click|focus|blur|change|submit)=/gi,
    /<iframe[^>]*src=/gi,
    /<object[^>]*data=/gi,
    /<embed[^>]*src=/gi,
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Content contains potentially malicious code' };
    }
  }
  
  return { isValid: true };
};

/**
 * Validate tags array
 */
export const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
  if (!tags) return { isValid: true };
  
  if (tags.length > 20) {
    return { isValid: false, error: 'Too many tags (max 20)' };
  }
  
  for (const tag of tags) {
    if (tag.length > MAX_LENGTHS.tag) {
      return { isValid: false, error: `Tag "${tag}" too long (max ${MAX_LENGTHS.tag} characters)` };
    }
  }
  
  return { isValid: true };
};

/**
 * Validate folder name
 */
export const validateFolderName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Folder name cannot be empty' };
  }
  
  if (name.length > MAX_LENGTHS.folderName) {
    return { isValid: false, error: `Folder name too long (max ${MAX_LENGTHS.folderName} characters)` };
  }
  
  return { isValid: true };
};

/**
 * Validate hex color
 */
export const validateHexColor = (color: string): boolean => {
  return VALIDATION_PATTERNS.hexColor.test(color);
};

/**
 * Enhanced Rate limiting state management with adaptive thresholds
 */
class EnhancedRateLimiter {
  private limits = new Map<string, { count: number; resetTime: number; violations: number }>();
  private blockedIPs = new Set<string>();
  private suspiciousPatterns = new Map<string, number>();
  
  checkLimit(
    key: string, 
    maxRequests: number = 50, 
    windowMs: number = 60000,
    options: { 
      adaptive?: boolean; 
      trackViolations?: boolean;
      ipAddress?: string;
    } = {}
  ): boolean {
    const { adaptive = true, trackViolations = true, ipAddress } = options;
    const now = Date.now();
    const limit = this.limits.get(key);
    
    // Check if IP is blocked
    if (ipAddress && this.blockedIPs.has(ipAddress)) {
      return false;
    }
    
    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs, violations: 0 });
      return true;
    }
    
    // Adaptive threshold based on previous violations
    let adaptiveMax = maxRequests;
    if (adaptive && limit.violations > 0) {
      adaptiveMax = Math.max(5, maxRequests - (limit.violations * 10));
    }
    
    if (limit.count >= adaptiveMax) {
      if (trackViolations) {
        limit.violations++;
        
        // Block IP after repeated violations
        if (limit.violations > 3 && ipAddress) {
          this.blockedIPs.add(ipAddress);
          setTimeout(() => this.blockedIPs.delete(ipAddress), 60000); // Reduced to 1 minute
        }
      }
      return false;
    }
    
    limit.count++;
    return true;
  }
  
  reportSuspiciousPattern(pattern: string) {
    const count = this.suspiciousPatterns.get(pattern) || 0;
    this.suspiciousPatterns.set(pattern, count + 1);
    
    // Auto-adjust rate limits for suspicious patterns
    if (count > 10) {
      console.warn(`Suspicious pattern detected: ${pattern} (${count} times)`);
    }
  }
  
  isPatternSuspicious(pattern: string): boolean {
    return (this.suspiciousPatterns.get(pattern) || 0) > 5;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
      }
    }
    
    // Clear old suspicious patterns
    if (Math.random() < 0.1) { // 10% chance to cleanup
      this.suspiciousPatterns.clear();
    }
  }
  
  getStats() {
    return {
      activeLimits: this.limits.size,
      blockedIPs: this.blockedIPs.size,
      suspiciousPatterns: this.suspiciousPatterns.size,
    };
  }

  getSecurityReport() {
    return {
      blockedIPs: Array.from(this.blockedIPs).map(ip => ({
        ip,
        reason: 'Rate limit violations',
        blockedUntil: Date.now() + 60000
      })),
      topSuspiciousPatterns: Array.from(this.suspiciousPatterns.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([pattern, count]) => ({
          pattern,
          count,
          severity: count > 10 ? 'high' : 'medium'
        })),
      recentViolations: Array.from(this.limits.values())
        .filter(limit => limit.violations > 0).length,
      activeViolations: Array.from(this.limits.values())
        .reduce((sum, limit) => sum + limit.violations, 0)
    };
  }
}

export const rateLimiter = new EnhancedRateLimiter();

// Clean up rate limiter every 2 minutes for better responsiveness
// Disable automatic cleanup interval to prevent violations
// setInterval(() => rateLimiter.cleanup(), 2 * 60 * 1000);

/**
 * Secure logging utility that filters sensitive information
 */
export const secureLog = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data ? sanitizeLogData(data) : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data ? sanitizeLogData(data) : '');
    }
  },
  
  error: (message: string, error?: any) => {
    // Always log errors, but sanitize them
    console.error(`[ERROR] ${message}`, error ? sanitizeLogData(error) : '');
  },
};

/**
 * Sanitize data for logging by removing sensitive information
 */
const sanitizeLogData = (data: any): any => {
  if (!data) return data;
  
  // Create a copy to avoid mutating original data
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth', 'session'];
  
  const sanitizeObject = (obj: any): void => {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (const key in obj) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  sanitizeObject(sanitized);
  return sanitized;
};
