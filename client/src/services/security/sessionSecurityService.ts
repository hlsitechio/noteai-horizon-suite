/**
 * Enhanced session security service with token rotation and anomaly detection
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SessionMetrics {
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  locationData?: {
    country?: string;
    city?: string;
  };
}

interface AnomalyDetection {
  unusualLocation: boolean;
  deviceChange: boolean;
  timeGap: boolean;
  suspiciousActivity: boolean;
}

export class SessionSecurityService {
  private sessionMetrics = new Map<string, SessionMetrics>();
  private suspiciousActivities = new Set<string>();
  private readonly maxSessionIdleTime = 30 * 60 * 1000; // 30 minutes
  private readonly tokenRotationInterval = 15 * 60 * 1000; // 15 minutes

  /**
   * Enhanced session validation with anomaly detection
   */
  validateSession(userId: string, context: {
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  }): { valid: boolean; anomalies: AnomalyDetection; action?: 'require_2fa' | 'force_logout' | 'monitor' } {
    const currentMetrics = this.sessionMetrics.get(userId);
    const now = Date.now();

    // Check for session timeout
    if (currentMetrics && (now - currentMetrics.lastActivity) > this.maxSessionIdleTime) {
      this.logSecurityEvent('session_timeout', { userId, lastActivity: currentMetrics.lastActivity });
      this.invalidateSession(userId);
      return {
        valid: false,
        anomalies: { unusualLocation: false, deviceChange: false, timeGap: true, suspiciousActivity: false },
        action: 'force_logout'
      };
    }

    const anomalies = this.detectAnomalies(userId, context, currentMetrics);
    
    // Update session metrics
    this.sessionMetrics.set(userId, {
      lastActivity: now,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      deviceFingerprint: context.deviceFingerprint,
    });

    // Determine action based on anomalies
    let action: 'require_2fa' | 'force_logout' | 'monitor' | undefined;
    
    if (anomalies.deviceChange || anomalies.unusualLocation) {
      action = 'require_2fa';
      this.logSecurityEvent('session_anomaly_detected', { userId, anomalies, context });
    } else if (anomalies.suspiciousActivity) {
      action = 'monitor';
      this.logSecurityEvent('suspicious_session_activity', { userId, context });
    }

    return {
      valid: true,
      anomalies,
      action
    };
  }

  /**
   * Detect session anomalies
   */
  private detectAnomalies(
    userId: string, 
    context: { ipAddress?: string; userAgent?: string; deviceFingerprint?: string },
    previousMetrics?: SessionMetrics
  ): AnomalyDetection {
    const anomalies: AnomalyDetection = {
      unusualLocation: false,
      deviceChange: false,
      timeGap: false,
      suspiciousActivity: false
    };

    if (!previousMetrics) {
      return anomalies;
    }

    // Check for device changes
    if (context.deviceFingerprint && previousMetrics.deviceFingerprint && 
        context.deviceFingerprint !== previousMetrics.deviceFingerprint) {
      anomalies.deviceChange = true;
    }

    // Check for user agent changes (simplified device detection)
    if (context.userAgent && previousMetrics.userAgent &&
        !this.isSimilarUserAgent(context.userAgent, previousMetrics.userAgent)) {
      anomalies.deviceChange = true;
    }

    // Check for IP address changes (simplified location detection)
    if (context.ipAddress && previousMetrics.ipAddress &&
        context.ipAddress !== previousMetrics.ipAddress) {
      anomalies.unusualLocation = true;
    }

    // Check for suspicious activity patterns
    if (this.suspiciousActivities.has(userId)) {
      anomalies.suspiciousActivity = true;
    }

    return anomalies;
  }

  /**
   * Check if user agents are similar (same browser family)
   */
  private isSimilarUserAgent(current: string, previous: string): boolean {
    const extractBrowser = (ua: string) => {
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Unknown';
    };

    return extractBrowser(current) === extractBrowser(previous);
  }

  /**
   * Invalidate session and force logout
   */
  async invalidateSession(userId: string): Promise<void> {
    try {
      this.sessionMetrics.delete(userId);
      this.suspiciousActivities.delete(userId);
      
      // Force logout from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      this.logSecurityEvent('session_invalidated', { userId });
    } catch (error) {
      logger.error('Failed to invalidate session', { userId, error });
    }
  }

  /**
   * Report suspicious activity
   */
  reportSuspiciousActivity(userId: string, activity: string, details?: any): void {
    this.suspiciousActivities.add(userId);
    
    // Clear suspicious flag after 1 hour
    setTimeout(() => {
      this.suspiciousActivities.delete(userId);
    }, 60 * 60 * 1000);

    this.logSecurityEvent('suspicious_activity_reported', {
      userId,
      activity,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rotate session token (if supported by auth provider)
   */
  async rotateSessionToken(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logger.error('Failed to rotate session token', { userId, error });
        return false;
      }

      this.logSecurityEvent('token_rotated', { userId });
      return true;
    } catch (error) {
      logger.error('Token rotation error', { userId, error });
      return false;
    }
  }

  /**
   * Get session security stats
   */
  getSessionStats() {
    return {
      activeSessions: this.sessionMetrics.size,
      suspiciousUsers: this.suspiciousActivities.size,
      sessionDetails: Array.from(this.sessionMetrics.entries()).map(([userId, metrics]) => ({
        userId,
        lastActivity: new Date(metrics.lastActivity).toISOString(),
        hasDeviceInfo: !!metrics.deviceFingerprint,
        hasLocationInfo: !!metrics.ipAddress
      }))
    };
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [userId, metrics] of this.sessionMetrics.entries()) {
      if ((now - metrics.lastActivity) > this.maxSessionIdleTime) {
        this.sessionMetrics.delete(userId);
        this.suspiciousActivities.delete(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cleaned up expired sessions', { cleanedCount });
    }
  }

  private logSecurityEvent(eventType: string, details: any): void {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      service: 'SessionSecurityService',
      ...details,
    };

    logger.warn('SECURITY', eventType, details);
  }
}

export const sessionSecurityService = new SessionSecurityService();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  sessionSecurityService.cleanupExpiredSessions();
}, 10 * 60 * 1000);