
import { toast } from 'sonner';

// Basic validation functions
export const validateNoteTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title cannot be empty' };
  }
  
  if (title.length > 500) {
    return { isValid: false, error: 'Title too long (max 500 characters)' };
  }
  
  // Check for dangerous patterns
  if (/<script|javascript:|data:text\/html/i.test(title)) {
    return { isValid: false, error: 'Title contains potentially dangerous content' };
  }
  
  return { isValid: true };
};

export const validateContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content) {
    return { isValid: true }; // Allow empty content
  }
  
  if (content.length > 10485760) { // 10MB limit
    return { isValid: false, error: 'Content too large (max 10MB)' };
  }
  
  // Enhanced XSS prevention
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on(load|error|click|focus|blur|change|submit)=/gi
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Content contains potentially dangerous code' };
    }
  }
  
  return { isValid: true };
};

export const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
  if (!tags || tags.length === 0) {
    return { isValid: true }; // Allow empty tags
  }
  
  if (tags.length > 20) {
    return { isValid: false, error: 'Too many tags (max 20)' };
  }
  
  for (const tag of tags) {
    if (tag.length > 50) {
      return { isValid: false, error: 'Tag too long (max 50 characters)' };
    }
    
    if (/<|>|script/i.test(tag)) {
      return { isValid: false, error: 'Tag contains invalid characters' };
    }
  }
  
  return { isValid: true };
};

// Rate limiting
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  checkLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const record = this.requests.get(key);
    if (!record) return 0;
    
    return Math.max(0, record.resetTime - Date.now());
  }
}

export const rateLimiter = new RateLimiter();

// Enhanced rate limiter with different tiers
class EnhancedRateLimiter {
  private limits = new Map<string, { count: number; resetTime: number; tier: string }>();
  
  checkLimit(
    key: string, 
    tier: 'basic' | 'premium' | 'admin' = 'basic',
    endpoint: string = 'default'
  ): { allowed: boolean; remaining?: number; resetTime?: number } {
    const limits = {
      basic: { requests: 100, window: 60000 },
      premium: { requests: 500, window: 60000 },
      admin: { requests: 1000, window: 60000 }
    };
    
    const config = limits[tier];
    const limitKey = `${key}:${endpoint}`;
    const now = Date.now();
    const record = this.limits.get(limitKey);
    
    if (!record || now > record.resetTime) {
      this.limits.set(limitKey, { 
        count: 1, 
        resetTime: now + config.window,
        tier 
      });
      return { 
        allowed: true, 
        remaining: config.requests - 1,
        resetTime: now + config.window
      };
    }
    
    if (record.count >= config.requests) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: record.resetTime
      };
    }
    
    record.count++;
    return { 
      allowed: true, 
      remaining: config.requests - record.count,
      resetTime: record.resetTime
    };
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();

// File validation
const allowedMimeTypes = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain'
] as const;

const dangerousExtensions = [
  '.exe',
  '.bat', 
  '.cmd',
  '.scr',
  '.pif',
  '.jar',
  '.vbs',
  '.js',
  '.jsp',
  '.asp',
  '.php'
] as const;

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File too large (max 10MB)' };
  }
  
  // Check MIME type
  if (!allowedMimeTypes.includes(file.type as typeof allowedMimeTypes[number])) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (dangerousExtensions.includes(extension as typeof dangerousExtensions[number])) {
    return { isValid: false, error: 'Dangerous file extension detected' };
  }
  
  return { isValid: true };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// XSS prevention
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Secure logging utility
class SecureLog {
  private sanitizeLogData(data: any): any {
    if (typeof data === 'string') {
      // Remove sensitive patterns
      return data
        .replace(/password[^&\s]*/gi, 'password=***')
        .replace(/token[^&\s]*/gi, 'token=***')
        .replace(/key[^&\s]*/gi, 'key=***');
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (['password', 'token', 'key', 'secret'].some(sensitive => 
          key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '***';
        } else {
          sanitized[key] = this.sanitizeLogData(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }
  
  info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data ? this.sanitizeLogData(data) : '');
  }
  
  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error ? this.sanitizeLogData(error) : '');
  }
  
  security(message: string, data?: any) {
    console.warn(`[SECURITY] ${message}`, data ? this.sanitizeLogData(data) : '');
  }
}

export const secureLog = new SecureLog();

// Content Security Policy helpers
export const setupCSP = () => {
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https://*.supabase.co"
  ].join('; ');
  
  document.head.appendChild(cspMeta);
};

// Initialize security measures
export const initializeSecurity = () => {
  setupCSP();
  secureLog.info('Security utilities initialized');
};

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeSecurity();
}
