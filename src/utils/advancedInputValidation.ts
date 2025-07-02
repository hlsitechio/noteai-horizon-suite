/**
 * Advanced input validation with enhanced security checks
 */

import { VALIDATION_PATTERNS, MAX_LENGTHS, sanitizeText } from './securityUtils';

// Extended validation patterns for advanced checks
export const ADVANCED_PATTERNS = {
  ...VALIDATION_PATTERNS,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  fileName: /^[a-zA-Z0-9._-]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  phoneNumber: /^\+?[1-9]\d{1,14}$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  sqlInjection: /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  xssScript: /<script[^>]*>.*?<\/script>/gi,
  dataUrl: /^data:[a-z]+\/[a-z0-9-+.]+;base64,/i,
} as const;

// Malicious pattern detection
export const MALICIOUS_PATTERNS = [
  // XSS patterns
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  /<link[^>]*>/gi,
  /<meta[^>]*>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi,
  
  // SQL injection patterns
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/gi,
  /((\%27)|(\'))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
  /exec(\s|\+)+(s|x)p\w+/gi,
  /union[^a-z]*select/gi,
  /drop[^a-z]*table/gi,
  /insert[^a-z]*into/gi,
  /delete[^a-z]*from/gi,
  
  // Command injection patterns
  /\|\s*\w+/g,
  /;\s*\w+/g,
  /&&\s*\w+/g,
  /\$\(\w+\)/g,
  /`\w+`/g,
  
  // Path traversal patterns
  /\.\.\//g,
  /\.\.\\/g,
  /%2e%2e%2f/gi,
  /%2e%2e\\/gi,
] as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
  threats?: string[];
}

/**
 * Advanced text validation with threat detection
 */
export const validateAdvancedText = (
  input: string,
  options: {
    maxLength?: number;
    allowEmpty?: boolean;
    allowHtml?: boolean;
    strictMode?: boolean;
  } = {}
): ValidationResult => {
  const {
    maxLength = MAX_LENGTHS.content,
    allowEmpty = true,
    allowHtml = false,
    strictMode = false,
  } = options;

  if (!input) {
    return allowEmpty 
      ? { isValid: true, sanitized: '' }
      : { isValid: false, error: 'Input cannot be empty' };
  }

  // Length validation
  if (input.length > maxLength) {
    return {
      isValid: false,
      error: `Input too long (max ${maxLength} characters)`,
    };
  }

  // Detect malicious patterns
  const threats: string[] = [];
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(`Malicious pattern detected: ${pattern.source}`);
    }
  }

  // In strict mode, any threats make the input invalid
  if (strictMode && threats.length > 0) {
    return {
      isValid: false,
      error: 'Input contains potentially malicious content',
      threats,
    };
  }

  // Sanitize the input
  let sanitized = sanitizeText(input);

  // Additional HTML sanitization if HTML is not allowed
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/<[^>]*>/g, '')
      .replace(/&lt;[^&]*&gt;/g, '');
  }

  return {
    isValid: true,
    sanitized,
    threats: threats.length > 0 ? threats : undefined,
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    allowedTypes?: string[];
    maxSize?: number;
    allowedExtensions?: string[];
  } = {}
): ValidationResult => {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large (max ${Math.round(maxSize / (1024 * 1024))}MB)`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed',
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'File extension not allowed',
    };
  }

  // Check filename for malicious patterns
  if (!ADVANCED_PATTERNS.fileName.test(file.name)) {
    return {
      isValid: false,
      error: 'Invalid filename',
    };
  }

  return { isValid: true };
};

/**
 * Validate URL input
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Basic URL pattern validation
  if (!ADVANCED_PATTERNS.url.test(url)) {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Check for suspicious URL patterns
  const suspiciousPatterns = [
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /file:/gi,
    /ftp:/gi,
  ];

  const threats: string[] = [];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      threats.push(`Suspicious URL scheme: ${pattern.source}`);
    }
  }

  if (threats.length > 0) {
    return {
      isValid: false,
      error: 'URL contains suspicious schemes',
      threats,
    };
  }

  return { isValid: true, sanitized: url.trim() };
};

/**
 * Validate email with advanced checks
 */
export const validateEmailAdvanced = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  // Basic pattern check
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Check for suspicious patterns
  const threats: string[] = [];
  
  // Check for unusual characters
  if (/[<>'"\\]/.test(email)) {
    threats.push('Email contains suspicious characters');
  }

  // Check for excessively long parts
  const [local, domain] = email.split('@');
  if (local.length > 64 || domain.length > 253) {
    threats.push('Email parts exceed standard lengths');
  }

  return {
    isValid: threats.length === 0,
    error: threats.length > 0 ? 'Email failed security validation' : undefined,
    sanitized: email.toLowerCase().trim(),
    threats: threats.length > 0 ? threats : undefined,
  };
};

/**
 * Validate JSON input safely
 */
export const validateJsonInput = (jsonString: string): ValidationResult => {
  if (!jsonString) {
    return { isValid: false, error: 'JSON cannot be empty' };
  }

  try {
    // Parse the JSON
    const parsed = JSON.parse(jsonString);
    
    // Check for potentially dangerous content in the parsed object
    const checkForThreats = (obj: any, path = ''): string[] => {
      const threats: string[] = [];
      
      if (typeof obj === 'string') {
        for (const pattern of MALICIOUS_PATTERNS) {
          if (pattern.test(obj)) {
            threats.push(`Malicious content at ${path}: ${pattern.source}`);
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const newPath = path ? `${path}.${key}` : key;
          threats.push(...checkForThreats(value, newPath));
        }
      }
      
      return threats;
    };

    const threats = checkForThreats(parsed);
    
    if (threats.length > 0) {
      return {
        isValid: false,
        error: 'JSON contains potentially malicious content',
        threats,
      };
    }

    return {
      isValid: true,
      sanitized: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON format',
    };
  }
};