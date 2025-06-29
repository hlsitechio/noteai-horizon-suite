
/**
 * Security utilities for input validation and sanitization - Enhanced with best practices
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  title: /^[a-zA-Z0-9\s\-_.,!?()[\]{}'"]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// Maximum lengths for different input types
export const MAX_LENGTHS = {
  title: 500,
  content: 10485760, // 10MB
  tag: 50,
  folderName: 255,
  displayName: 100,
  email: 254,
  password: 128,
  phone: 20,
  url: 2048,
} as const;

// Security constants
export const SECURITY_CONSTANTS = {
  BCRYPT_ROUNDS: 12,
  TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 1 week
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
  BLOCKED_EXTENSIONS: ['.exe', '.bat', '.cmd', '.scr', '.pif', '.jar', '.vbs', '.js', '.jsp', '.asp', '.php'],
} as const;

/**
 * Enhanced sanitization with additional security measures
 */
export const sanitizeText = (input: string, options: { maxLength?: number; stripHtml?: boolean } = {}): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Strip HTML if requested
  if (options.stripHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Enhanced XSS prevention
  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/data:application\/javascript/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(/gi, '')
    .replace(/&#x?[0-9a-f]+;?/gi, '') // Remove HTML entities
    .trim();
  
  // Apply length limit
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  return sanitized;
};

/**
 * Validate and sanitize file uploads
 */
export const validateFile = (file: File): { isValid: boolean; error?: string; sanitizedName?: string } => {
  // Check file size
  if (file.size > SECURITY_CONSTANTS.MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size exceeds maximum allowed size (10MB)' };
  }
  
  // Check file type
  if (!SECURITY_CONSTANTS.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }
  
  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (SECURITY_CONSTANTS.BLOCKED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: 'File extension not allowed' };
  }
  
  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9\-_\.\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
  
  // Check for suspicious patterns in filename
  if (/\.{2,}|\/|\\|\||\*|\?|<|>|:|"/.test(sanitizedName)) {
    return { isValid: false, error: 'Invalid filename characters' };
  }
  
  return { isValid: true, sanitizedName };
};

/**
 * Enhanced password validation with security best practices
 */
export const validatePassword = (password: string): { isValid: boolean; score: number; errors: string[] } => {
  const errors: string[] = [];
  let score = 0;
  
  if (!password) {
    return { isValid: false, score: 0, errors: ['Password is required'] };
  }
  
  // Length check
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else if (password.length >= 12) {
    score += 2;
  }
  
  // Complexity checks
  if (/[a-z]/.test(password)) score += 1;
  else errors.push('Password must contain at least one lowercase letter');
  
  if (/[A-Z]/.test(password)) score += 1;
  else errors.push('Password must contain at least one uppercase letter');
  
  if (/\d/.test(password)) score += 1;
  else errors.push('Password must contain at least one number');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else errors.push('Password must contain at least one special character');
  
  // Pattern checks
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
    score -= 1;
  }
  
  // Common password checks
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 
    'monkey', '1234567890', 'password123', 'admin123'
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password cannot contain common words or patterns');
    score -= 2;
  }
  
  // Sequential characters
  if (/abc|bcd|cde|123|234|345|789|890/i.test(password)) {
    errors.push('Password cannot contain sequential characters');
    score -= 1;
  }
  
  return {
    isValid: errors.length === 0 && score >= 4,
    score: Math.max(0, Math.min(10, score)),
    errors
  };
};

/**
 * Enhanced email validation with additional security checks
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (email.length > MAX_LENGTHS.email) {
    return { isValid: false, error: 'Email address too long' };
  }
  
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Additional security checks
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Check for suspicious patterns
  if (email.includes('<') || email.includes('>') || email.includes('"')) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }
  
  // Check for dangerous TLDs (optional - can be customized)
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
  if (suspiciousTlds.some(tld => email.endsWith(tld))) {
    return { isValid: false, error: 'Email domain not allowed' };
  }
  
  return { isValid: true };
};

/**
 * Enhanced content validation with comprehensive security checks
 */
export const validateContent = (content: string, type: 'note' | 'comment' | 'message' = 'note'): { isValid: boolean; error?: string } => {
  if (!content) return { isValid: true }; // Allow empty content
  
  const maxLength = type === 'note' ? MAX_LENGTHS.content : 10000;
  
  if (content.length > maxLength) {
    return { isValid: false, error: `Content too large (max ${maxLength} characters)` };
  }
  
  // Comprehensive malicious content detection
  const maliciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*stylesheet[^>]*>/gi,
    /<style[^>]*>.*?<\/style>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /import\s+/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Content contains potentially malicious code' };
    }
  }
  
  // Check for suspicious base64 patterns
  if (/data:.*base64,/.test(content) && !/data:image\/[^;]+;base64,/.test(content)) {
    return { isValid: false, error: 'Suspicious base64 content detected' };
  }
  
  return { isValid: true };
};

/**
 * Enhanced rate limiting with user-specific limits
 */
class EnhancedRateLimiter {
  private limits = new Map<string, { count: number; resetTime: number; blocked: boolean }>();
  private userLimits = new Map<string, { requests: number; window: number }>(); // Custom limits per user
  
  setUserLimit(userId: string, requests: number, windowMs: number = 60000) {
    this.userLimits.set(userId, { requests, window: windowMs });
  }
  
  checkLimit(key: string, userId?: string, maxRequests: number = 50, windowMs: number = 60000): boolean {
    const now = Date.now();
    const limit = this.limits.get(key);
    
    // Get user-specific limits if available
    if (userId && this.userLimits.has(userId)) {
      const userLimit = this.userLimits.get(userId)!;
      maxRequests = userLimit.requests;
      windowMs = userLimit.window;
    }
    
    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs, blocked: false });
      return true;
    }
    
    if (limit.blocked) {
      return false;
    }
    
    if (limit.count >= maxRequests) {
      limit.blocked = true;
      // Auto-unblock after additional time
      setTimeout(() => {
        this.limits.delete(key);
      }, windowMs * 2);
      return false;
    }
    
    limit.count++;
    return true;
  }
  
  isBlocked(key: string): boolean {
    const limit = this.limits.get(key);
    return limit?.blocked || false;
  }
  
  getRemainingRequests(key: string, maxRequests: number = 50): number {
    const limit = this.limits.get(key);
    if (!limit) return maxRequests;
    return Math.max(0, maxRequests - limit.count);
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();

// Clean up rate limiter every 5 minutes
setInterval(() => enhancedRateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * Content Security Policy helper
 */
export const setupCSP = () => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://qrdulwzjgbfgaplazgsh.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];
  
  const csp = cspDirectives.join('; ');
  
  // Set CSP via meta tag
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = 'Content-Security-Policy';
  metaTag.content = csp;
  document.head.appendChild(metaTag);
};

/**
 * Secure logging utility that filters sensitive information
 */
export const secureLog = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data ? sanitizeLogData(data) : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, data ? sanitizeLogData(data) : '');
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? sanitizeLogData(error) : '');
  },
  
  security: (message: string, data?: any) => {
    console.warn(`[SECURITY] ${message}`, data ? sanitizeLogData(data) : '');
  },
};

/**
 * Sanitize data for logging by removing sensitive information
 */
const sanitizeLogData = (data: any): any => {
  if (!data) return data;
  
  const sensitiveFields = [
    'password', 'token', 'key', 'secret', 'auth', 'session', 'jwt',
    'authorization', 'cookie', 'api_key', 'access_token', 'refresh_token',
    'private_key', 'client_secret'
  ];
  
  try {
    const sanitized = JSON.parse(JSON.stringify(data));
    
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
  } catch (error) {
    return '[UNABLE_TO_SANITIZE]';
  }
};

/**
 * Generate secure random values
 */
export const generateSecure = {
  id: (): string => {
    return crypto.randomUUID();
  },
  
  token: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  nonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },
  
  salt: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};

/**
 * Input sanitization for different contexts
 */
export const sanitizeForContext = {
  html: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },
  
  attribute: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  url: (input: string): string => {
    return encodeURIComponent(input);
  },
  
  css: (input: string): string => {
    return input.replace(/[<>"'&]/g, '');
  }
};

// Initialize CSP on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupCSP);
}
