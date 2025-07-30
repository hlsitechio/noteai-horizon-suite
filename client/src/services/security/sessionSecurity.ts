import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SessionMetrics {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  requestCount: number;
  ipAddress?: string;
  userAgent?: string;
  riskScore: number;
  flags: string[];
}

interface SessionSecurityConfig {
  maxIdleTime: number; // milliseconds
  maxSessionDuration: number; // milliseconds
  maxRequestsPerMinute: number;
  enableTokenRotation: boolean;
  suspiciousActivityThreshold: number;
}

class EnhancedSessionSecurityService {
  private activeSessions = new Map<string, SessionMetrics>();
  private suspiciousActivities = new Map<string, number>();
  
  private config: SessionSecurityConfig = {
    maxIdleTime: 30 * 60 * 1000, // 30 minutes
    maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours
    maxRequestsPerMinute: 100,
    enableTokenRotation: true,
    suspiciousActivityThreshold: 5
  };

  initializeSession(sessionData: {
    sessionId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
  }): void {
    const now = Date.now();
    
    this.activeSessions.set(sessionData.sessionId, {
      ...sessionData,
      startTime: now,
      lastActivity: now,
      requestCount: 0,
      riskScore: 0,
      flags: []
    });

    logger.info('Session initialized', {
      sessionId: sessionData.sessionId,
      userId: sessionData.userId
    });
  }

  validateSessionActivity(sessionId: string, activity: {
    endpoint?: string;
    ipAddress?: string;
    userAgent?: string;
  }): {
    isValid: boolean;
    shouldRotateToken: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    actions: string[];
  } {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return {
        isValid: false,
        shouldRotateToken: false,
        riskLevel: 'high',
        actions: ['terminate_session']
      };
    }

    const now = Date.now();
    const actions: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let shouldRotateToken = false;

    // Check session timeout
    if (now - session.lastActivity > this.config.maxIdleTime) {
      actions.push('session_expired');
      return {
        isValid: false,
        shouldRotateToken: false,
        riskLevel: 'medium',
        actions
      };
    }

    // Check maximum session duration
    if (now - session.startTime > this.config.maxSessionDuration) {
      actions.push('max_duration_exceeded');
      shouldRotateToken = true;
      riskLevel = 'medium';
    }

    // Update session metrics
    session.lastActivity = now;
    session.requestCount++;

    // Check for suspicious activity patterns
    const suspiciousChecks = this.checkSuspiciousActivity(session, activity);
    session.riskScore = suspiciousChecks.riskScore;
    session.flags.push(...suspiciousChecks.newFlags);

    if (suspiciousChecks.riskScore > this.config.suspiciousActivityThreshold) {
      riskLevel = 'high';
      actions.push('suspicious_activity_detected');
      shouldRotateToken = true;
    }

    // Check request rate
    const requestRate = this.calculateRequestRate(sessionId);
    if (requestRate > this.config.maxRequestsPerMinute) {
      riskLevel = 'high';
      actions.push('rate_limit_exceeded');
      session.flags.push('high_request_rate');
    }

    // Determine if token rotation is needed
    if (this.config.enableTokenRotation && this.shouldRotateToken(session)) {
      shouldRotateToken = true;
      actions.push('token_rotation_required');
    }

    return {
      isValid: true,
      shouldRotateToken,
      riskLevel,
      actions
    };
  }

  async rotateSessionToken(sessionId: string): Promise<{
    success: boolean;
    newToken?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logger.error('Token rotation failed:', error);
        return { success: false, error: error.message };
      }

      if (data.session) {
        // Update session with new token info
        const session = this.activeSessions.get(sessionId);
        if (session) {
          session.flags.push('token_rotated');
          session.lastActivity = Date.now();
        }

        logger.info('Session token rotated successfully', { sessionId });
        return { 
          success: true, 
          newToken: data.session.access_token 
        };
      }

      return { success: false, error: 'No session data received' };
    } catch (error) {
      logger.error('Token rotation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  terminateSession(sessionId: string, reason: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      logger.warn('Session terminated', {
        sessionId,
        reason,
        duration: Date.now() - session.startTime,
        riskScore: session.riskScore,
        flags: session.flags
      });

      this.activeSessions.delete(sessionId);
      this.suspiciousActivities.delete(sessionId);
    }

    // Terminate Supabase session
    supabase.auth.signOut();
  }

  getSessionMetrics(sessionId: string): SessionMetrics | null {
    return this.activeSessions.get(sessionId) || null;
  }

  getAllActiveSessions(): SessionMetrics[] {
    return Array.from(this.activeSessions.values());
  }

  getSecurityStats(): {
    totalActiveSessions: number;
    suspiciousSessions: number;
    highRiskSessions: number;
    averageRiskScore: number;
  } {
    const sessions = Array.from(this.activeSessions.values());
    const suspiciousSessions = sessions.filter(s => s.flags.length > 0);
    const highRiskSessions = sessions.filter(s => s.riskScore > this.config.suspiciousActivityThreshold);
    const averageRiskScore = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.riskScore, 0) / sessions.length 
      : 0;

    return {
      totalActiveSessions: sessions.length,
      suspiciousSessions: suspiciousSessions.length,
      highRiskSessions: highRiskSessions.length,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100
    };
  }

  private checkSuspiciousActivity(
    session: SessionMetrics, 
    activity: { endpoint?: string; ipAddress?: string; userAgent?: string }
  ): { riskScore: number; newFlags: string[] } {
    const newFlags: string[] = [];
    let riskScore = session.riskScore;

    // Check IP address changes
    if (activity.ipAddress && session.ipAddress && activity.ipAddress !== session.ipAddress) {
      riskScore += 2;
      newFlags.push('ip_address_change');
    }

    // Check user agent changes
    if (activity.userAgent && session.userAgent && activity.userAgent !== session.userAgent) {
      riskScore += 1;
      newFlags.push('user_agent_change');
    }

    // Check for admin endpoint access
    if (activity.endpoint?.includes('/admin') || activity.endpoint?.includes('/api/admin')) {
      riskScore += 1;
      newFlags.push('admin_access_attempt');
    }

    // Check for multiple rapid requests
    const recentActivity = this.suspiciousActivities.get(session.sessionId) || 0;
    if (recentActivity > 5) {
      riskScore += 2;
      newFlags.push('rapid_requests');
    }

    // Update suspicious activity counter
    this.suspiciousActivities.set(session.sessionId, recentActivity + 1);

    // Decay suspicious activity counter over time
    setTimeout(() => {
      const current = this.suspiciousActivities.get(session.sessionId) || 0;
      if (current > 0) {
        this.suspiciousActivities.set(session.sessionId, current - 1);
      }
    }, 60000); // Decay after 1 minute

    return { riskScore: Math.min(riskScore, 10), newFlags };
  }

  private calculateRequestRate(sessionId: string): number {
    const session = this.activeSessions.get(sessionId);
    if (!session) return 0;

    const timeWindow = Math.min(Date.now() - session.startTime, 60000); // 1 minute window
    return (session.requestCount / timeWindow) * 60000; // requests per minute
  }

  private shouldRotateToken(session: SessionMetrics): boolean {
    const now = Date.now();
    const sessionAge = now - session.startTime;
    
    // Rotate token every 2 hours or if risk score is elevated
    return sessionAge > 2 * 60 * 60 * 1000 || session.riskScore > 3;
  }

  // Cleanup expired sessions periodically
  startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      const expiredSessions: string[] = [];

      this.activeSessions.forEach((session, sessionId) => {
        const idleTime = now - session.lastActivity;
        const totalTime = now - session.startTime;

        if (idleTime > this.config.maxIdleTime || totalTime > this.config.maxSessionDuration) {
          expiredSessions.push(sessionId);
        }
      });

      expiredSessions.forEach(sessionId => {
        this.terminateSession(sessionId, 'automatic_cleanup');
      });

      if (expiredSessions.length > 0) {
        logger.info(`Cleaned up ${expiredSessions.length} expired sessions`);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}

export const enhancedSessionSecurityService = new EnhancedSessionSecurityService();