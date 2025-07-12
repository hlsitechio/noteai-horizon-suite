import { logger } from '@/utils/logger';

interface EncryptionOptions {
  algorithm?: string;
  keyLength?: number;
  ivLength?: number;
}

interface PIIDetectionResult {
  hasPII: boolean;
  piiTypes: string[];
  redactedData: string;
  confidence: number;
}

class DataProtectionService {
  private readonly defaultOptions: EncryptionOptions = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12
  };

  private piiPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    passport: /\b[A-Z]{1,2}[0-9]{6,9}\b/g
  };

  async encryptSensitiveData(data: string, key?: CryptoKey): Promise<{
    encrypted: string;
    keyId: string;
    iv: string;
  }> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      // Generate or use provided key
      const cryptoKey = key || await this.generateKey();
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(this.defaultOptions.ivLength!));

      // Encrypt data
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.defaultOptions.algorithm!,
          iv: iv
        },
        cryptoKey,
        dataBuffer
      );

      // Convert to base64 for storage
      const encryptedArray = new Uint8Array(encrypted);
      const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
      const ivBase64 = btoa(String.fromCharCode(...iv));

      // Generate key identifier (hash of key)
      const keyBuffer = await crypto.subtle.exportKey('raw', cryptoKey);
      const keyHash = await crypto.subtle.digest('SHA-256', keyBuffer);
      const keyId = btoa(String.fromCharCode(...new Uint8Array(keyHash.slice(0, 8))));

      return {
        encrypted: encryptedBase64,
        keyId,
        iv: ivBase64
      };
    } catch (error) {
      logger.error('Data encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  async decryptSensitiveData(
    encryptedData: string,
    iv: string,
    key: CryptoKey
  ): Promise<string> {
    try {
      // Convert from base64
      const encryptedArray = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      const ivArray = new Uint8Array(
        atob(iv).split('').map(char => char.charCodeAt(0))
      );

      // Decrypt data
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.defaultOptions.algorithm!,
          iv: ivArray
        },
        key,
        encryptedArray
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      logger.error('Data decryption failed:', error);
      throw new Error('Decryption failed');
    }
  }

  detectPII(data: string): PIIDetectionResult {
    const piiTypes: string[] = [];
    let redactedData = data;
    let totalMatches = 0;

    // Check each PII pattern
    Object.entries(this.piiPatterns).forEach(([type, pattern]) => {
      const matches = data.match(pattern);
      if (matches) {
        piiTypes.push(type);
        totalMatches += matches.length;
        
        // Redact the PII data
        redactedData = redactedData.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
      }
    });

    // Calculate confidence based on pattern strength
    const confidence = this.calculatePIIConfidence(piiTypes, totalMatches);

    return {
      hasPII: piiTypes.length > 0,
      piiTypes,
      redactedData,
      confidence
    };
  }

  sanitizeUserInput(input: string): string {
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }

  anonymizeData(data: any, fieldsToAnonymize: string[]): any {
    const anonymized = JSON.parse(JSON.stringify(data));

    const anonymizeValue = (obj: any, path: string[]) => {
      if (path.length === 1) {
        const field = path[0];
        if (obj[field] !== undefined) {
          if (typeof obj[field] === 'string') {
            obj[field] = this.hashValue(obj[field]);
          } else if (typeof obj[field] === 'number') {
            obj[field] = Math.floor(Math.random() * 1000000);
          }
        }
      } else {
        const [current, ...rest] = path;
        if (obj[current] && typeof obj[current] === 'object') {
          anonymizeValue(obj[current], rest);
        }
      }
    };

    fieldsToAnonymize.forEach(field => {
      const path = field.split('.');
      anonymizeValue(anonymized, path);
    });

    return anonymized;
  }

  async generateDataHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return btoa(String.fromCharCode(...hashArray));
  }

  validateDataIntegrity(
    originalHash: string,
    data: string
  ): Promise<boolean> {
    return this.generateDataHash(data).then(newHash => newHash === originalHash);
  }

  classifyDataSensitivity(data: any): {
    level: 'public' | 'internal' | 'confidential' | 'restricted';
    reasons: string[];
  } {
    const reasons: string[] = [];
    let level: 'public' | 'internal' | 'confidential' | 'restricted' = 'public';

    const dataString = JSON.stringify(data).toLowerCase();

    // Check for restricted data
    if (this.containsRestrictedData(dataString)) {
      level = 'restricted';
      reasons.push('Contains restricted information (SSN, payment data, etc.)');
    }
    // Check for confidential data
    else if (this.containsConfidentialData(dataString)) {
      level = 'confidential';
      reasons.push('Contains confidential information (PII, credentials, etc.)');
    }
    // Check for internal data
    else if (this.containsInternalData(dataString)) {
      level = 'internal';
      reasons.push('Contains internal information (user data, analytics, etc.)');
    }

    return { level, reasons };
  }

  private async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.defaultOptions.algorithm!,
        length: this.defaultOptions.keyLength!
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private calculatePIIConfidence(piiTypes: string[], totalMatches: number): number {
    if (totalMatches === 0) return 0;
    
    // Higher confidence for more specific PII types
    const weights = {
      ssn: 0.9,
      creditCard: 0.9,
      passport: 0.8,
      email: 0.7,
      phone: 0.6,
      ipAddress: 0.4
    };

    const weightedScore = piiTypes.reduce((sum, type) => {
      return sum + (weights[type as keyof typeof weights] || 0.5);
    }, 0);

    return Math.min(weightedScore / piiTypes.length, 1);
  }

  private hashValue(value: string): string {
    // Simple hash for anonymization (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ANON_${Math.abs(hash).toString(36)}`;
  }

  private containsRestrictedData(data: string): boolean {
    const restrictedKeywords = [
      'ssn', 'social security', 'passport', 'driver license',
      'credit card', 'payment', 'bank account', 'routing number'
    ];
    return restrictedKeywords.some(keyword => data.includes(keyword));
  }

  private containsConfidentialData(data: string): boolean {
    const confidentialKeywords = [
      'password', 'secret', 'private key', 'token', 'api key',
      'personal', 'medical', 'health', 'financial'
    ];
    return confidentialKeywords.some(keyword => data.includes(keyword));
  }

  private containsInternalData(data: string): boolean {
    const internalKeywords = [
      'user_id', 'internal', 'employee', 'analytics',
      'metrics', 'dashboard', 'admin'
    ];
    return internalKeywords.some(keyword => data.includes(keyword));
  }
}

export const dataProtectionService = new DataProtectionService();