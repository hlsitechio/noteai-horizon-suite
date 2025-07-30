/**
 * API Key security service with rotation and monitoring
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface ApiKeyMetadata {
  keyId: string;
  maskedKey: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  source: string;
  expiresAt?: Date;
  isActive: boolean;
}

interface ApiKeyUsage {
  keyId: string;
  endpoint: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export class ApiKeySecurityService {
  private keyMetadata = new Map<string, ApiKeyMetadata>();
  private keyUsage: ApiKeyUsage[] = [];
  private suspiciousKeys = new Set<string>();
  private readonly maxUsageHistory = 10000;
  private readonly keyRotationWarningDays = 30;

  /**
   * Validate and track API key usage
   */
  validateApiKey(
    key: string, 
    context: {
      endpoint: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): { valid: boolean; keyId?: string; warnings?: string[] } {
    const keyId = this.generateKeyId(key);
    const metadata = this.keyMetadata.get(keyId);
    const warnings: string[] = [];

    // Track usage regardless of validity
    this.trackApiKeyUsage({
      keyId,
      endpoint: context.endpoint,
      timestamp: new Date(),
      success: !!metadata?.isActive,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    // Check if key exists and is active
    if (!metadata || !metadata.isActive) {
      this.reportSuspiciousKeyUsage(keyId, 'invalid_key_attempt', context);
      return { valid: false };
    }

    // Check expiration
    if (metadata.expiresAt && metadata.expiresAt < new Date()) {
      warnings.push('API key has expired');
      this.updateKeyMetadata(keyId, { isActive: false });
      return { valid: false, keyId, warnings };
    }

    // Check for rotation warning
    const daysSinceCreation = (Date.now() - metadata.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > this.keyRotationWarningDays) {
      warnings.push(`API key is ${Math.floor(daysSinceCreation)} days old - consider rotation`);
    }

    // Check for suspicious usage patterns
    if (this.detectSuspiciousKeyUsage(keyId, context)) {
      warnings.push('Suspicious usage pattern detected');
      this.suspiciousKeys.add(keyId);
    }

    // Update usage metadata
    this.updateKeyMetadata(keyId, {
      lastUsed: new Date(),
      usageCount: metadata.usageCount + 1,
    });

    return { valid: true, keyId, warnings };
  }

  /**
   * Register a new API key for monitoring
   */
  registerApiKey(options: {
    key: string;
    source: string;
    expiresAt?: Date;
  }): string {
    const keyId = this.generateKeyId(options.key);
    const maskedKey = this.maskApiKey(options.key);

    this.keyMetadata.set(keyId, {
      keyId,
      maskedKey,
      createdAt: new Date(),
      usageCount: 0,
      source: options.source,
      expiresAt: options.expiresAt,
      isActive: true,
    });

    logger.info('API key registered for monitoring', {
      keyId,
      maskedKey,
      source: options.source,
    });

    return keyId;
  }

  /**
   * Rotate API key (mark old as inactive, register new)
   */
  rotateApiKey(oldKey: string, newKey: string, source: string): { oldKeyId: string; newKeyId: string } {
    const oldKeyId = this.generateKeyId(oldKey);
    const newKeyId = this.generateKeyId(newKey);

    // Deactivate old key
    this.updateKeyMetadata(oldKeyId, { isActive: false });

    // Register new key
    this.registerApiKey({
      key: newKey,
      source,
      expiresAt: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)), // 90 days
    });

    logger.info('API key rotated', {
      oldKeyId,
      newKeyId,
      source,
    });

    return { oldKeyId, newKeyId };
  }

  /**
   * Detect suspicious API key usage patterns
   */
  private detectSuspiciousKeyUsage(
    keyId: string,
    context: { endpoint: string; ipAddress?: string; userAgent?: string }
  ): boolean {
    const recentUsage = this.getRecentKeyUsage(keyId, 60 * 60 * 1000); // Last hour

    // Check for rapid usage spikes
    if (recentUsage.length > 100) {
      this.logSecurityEvent('api_key_usage_spike', {
        keyId,
        usageCount: recentUsage.length,
        context,
      });
      return true;
    }

    // Check for multiple IP addresses
    const uniqueIPs = new Set(
      recentUsage
        .filter(usage => usage.ipAddress)
        .map(usage => usage.ipAddress)
    );

    if (uniqueIPs.size > 3) {
      this.logSecurityEvent('api_key_multiple_ips', {
        keyId,
        ipCount: uniqueIPs.size,
        ips: Array.from(uniqueIPs),
        context,
      });
      return true;
    }

    // Check for unusual failure rates
    const failureRate = recentUsage.filter(u => !u.success).length / recentUsage.length;
    if (recentUsage.length > 10 && failureRate > 0.5) {
      this.logSecurityEvent('api_key_high_failure_rate', {
        keyId,
        failureRate,
        totalRequests: recentUsage.length,
        context,
      });
      return true;
    }

    return false;
  }

  /**
   * Get recent usage for a key
   */
  private getRecentKeyUsage(keyId: string, timeWindowMs: number): ApiKeyUsage[] {
    const cutoff = new Date(Date.now() - timeWindowMs);
    return this.keyUsage.filter(
      usage => usage.keyId === keyId && usage.timestamp > cutoff
    );
  }

  /**
   * Track API key usage
   */
  private trackApiKeyUsage(usage: ApiKeyUsage): void {
    this.keyUsage.push(usage);

    // Trim usage history if needed
    if (this.keyUsage.length > this.maxUsageHistory) {
      this.keyUsage = this.keyUsage.slice(-this.maxUsageHistory);
    }
  }

  /**
   * Update key metadata
   */
  private updateKeyMetadata(keyId: string, updates: Partial<ApiKeyMetadata>): void {
    const existing = this.keyMetadata.get(keyId);
    if (existing) {
      this.keyMetadata.set(keyId, { ...existing, ...updates });
    }
  }

  /**
   * Generate consistent key ID from API key
   */
  private generateKeyId(key: string): string {
    // Simple hash for key identification (don't store actual keys)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `key_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Mask API key for logging
   */
  private maskApiKey(key: string): string {
    if (key.length <= 8) return '***';
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  }

  /**
   * Report suspicious key usage
   */
  private reportSuspiciousKeyUsage(
    keyId: string,
    reason: string,
    context: { endpoint: string; ipAddress?: string; userAgent?: string }
  ): void {
    this.logSecurityEvent('suspicious_api_key_usage', {
      keyId,
      reason,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get API key security statistics
   */
  getApiKeyStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const recentUsage = this.keyUsage.filter(u => u.timestamp > oneHourAgo);
    const dailyUsage = this.keyUsage.filter(u => u.timestamp > oneDayAgo);

    const activeKeys = Array.from(this.keyMetadata.values()).filter(k => k.isActive);
    const expiredKeys = Array.from(this.keyMetadata.values()).filter(
      k => k.expiresAt && k.expiresAt < now
    );

    const keysNeedingRotation = activeKeys.filter(k => {
      const daysSinceCreation = (now.getTime() - k.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreation > this.keyRotationWarningDays;
    });

    return {
      totalKeys: this.keyMetadata.size,
      activeKeys: activeKeys.length,
      expiredKeys: expiredKeys.length,
      suspiciousKeys: this.suspiciousKeys.size,
      keysNeedingRotation: keysNeedingRotation.length,
      recentUsage: recentUsage.length,
      dailyUsage: dailyUsage.length,
      successRate: dailyUsage.length > 0 
        ? dailyUsage.filter(u => u.success).length / dailyUsage.length 
        : 1,
      keyDetails: activeKeys.map(k => ({
        keyId: k.keyId,
        maskedKey: k.maskedKey,
        source: k.source,
        usageCount: k.usageCount,
        lastUsed: k.lastUsed?.toISOString(),
        daysSinceCreation: Math.floor((now.getTime() - k.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
        needsRotation: keysNeedingRotation.includes(k),
      })),
    };
  }

  /**
   * Clean up old usage data
   */
  cleanup(): void {
    const oneWeekAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    
    // Remove old usage records
    const initialLength = this.keyUsage.length;
    this.keyUsage = this.keyUsage.filter(usage => usage.timestamp > oneWeekAgo);
    
    // Clear suspicious flags for inactive keys
    for (const keyId of this.suspiciousKeys) {
      const metadata = this.keyMetadata.get(keyId);
      if (!metadata || !metadata.isActive) {
        this.suspiciousKeys.delete(keyId);
      }
    }

    const cleaned = initialLength - this.keyUsage.length;
    if (cleaned > 0) {
      logger.info('API key usage cleanup completed', { cleaned });
    }
  }

  private logSecurityEvent(eventType: string, details: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      service: 'ApiKeySecurityService',
      ...details,
    };

    logger.warn('SECURITY', eventType, details);
  }
}

export const apiKeySecurityService = new ApiKeySecurityService();

// Cleanup every hour
setInterval(() => {
  apiKeySecurityService.cleanup();
}, 60 * 60 * 1000);