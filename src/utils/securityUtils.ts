
/**
 * Security Utilities
 * Provides rate limiting and secure logging capabilities
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  checkLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

class SecureLogger {
  private sanitizeMessage(message: string): string {
    // Remove sensitive information
    return message
      .replace(/password[=:]\s*\S+/gi, 'password=***')
      .replace(/token[=:]\s*\S+/gi, 'token=***')
      .replace(/api[_-]?key[=:]\s*\S+/gi, 'api_key=***');
  }

  error(message: string, context?: Record<string, any>) {
    const sanitizedMessage = this.sanitizeMessage(message);
    const sanitizedContext = context ? this.sanitizeContext(context) : {};
    
    console.error(sanitizedMessage, sanitizedContext);
  }

  warn(message: string, context?: Record<string, any>) {
    const sanitizedMessage = this.sanitizeMessage(message);
    const sanitizedContext = context ? this.sanitizeContext(context) : {};
    
    console.warn(sanitizedMessage, sanitizedContext);
  }

  info(message: string, context?: Record<string, any>) {
    const sanitizedMessage = this.sanitizeMessage(message);
    const sanitizedContext = context ? this.sanitizeContext(context) : {};
    
    console.info(sanitizedMessage, sanitizedContext);
  }

  security(message: string, context?: Record<string, any>) {
    const sanitizedMessage = this.sanitizeMessage(message);
    const sanitizedContext = context ? this.sanitizeContext(context) : {};
    
    console.warn(`🔐 SECURITY: ${sanitizedMessage}`, sanitizedContext);
  }

  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeMessage(value);
      } else if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        sanitized[key] = '***';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Validation functions
export const validateNoteTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (title.length > 200) {
    return { isValid: false, error: 'Title too long (max 200 characters)' };
  }

  // Check for potentially dangerous content
  if (/<script|javascript:|data:text\/html/i.test(title)) {
    return { isValid: false, error: 'Title contains invalid content' };
  }

  return { isValid: true };
};

export const validateNoteContent = (content: string): { isValid: boolean; error?: string } => {
  if (content.length > 1000000) { // 1MB limit
    return { isValid: false, error: 'Content too long (max 1MB)' };
  }

  return { isValid: true };
};

export const validateTags = (tags: string[]): { isValid: boolean; error?: string } => {
  if (tags.length > 20) {
    return { isValid: false, error: 'Too many tags (max 20)' };
  }

  for (const tag of tags) {
    if (tag.length > 50) {
      return { isValid: false, error: 'Tag too long (max 50 characters)' };
    }
    
    if (/<script|javascript:|data:text\/html/i.test(tag)) {
      return { isValid: false, error: 'Tag contains invalid content' };
    }
  }

  return { isValid: true };
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const rateLimiter = new RateLimiter();
export const secureLog = new SecureLogger();

// Enhanced rate limiter (alias for compatibility)
export const enhancedRateLimiter = rateLimiter;

// Cleanup rate limiter periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60000); // Every minute
}
