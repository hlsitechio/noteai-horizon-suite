import { useEffect, useCallback } from 'react';
import { advancedThreatDetectionService } from '@/services/security/advancedThreatDetection';
import { dataProtectionService } from '@/services/security/dataProtection';
import { enhancedSessionSecurityService } from '@/services/security/sessionSecurity';
import { securityHeadersService } from '@/services/security';
import { logger } from '@/utils/logger';

interface SecurityEvent {
  type: 'threat_detected' | 'data_breach' | 'suspicious_activity' | 'compliance_violation' | 'session_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  timestamp: number;
  source: string;
}

interface SecurityMetrics {
  threatCount: number;
  dataBreachAttempts: number;
  sessionAnomalies: number;
  complianceViolations: number;
  securityScore: number;
}

export const useEnhancedSecurityMonitoring = () => {
  const logSecurityEvent = useCallback((event: SecurityEvent) => {
    // Enhanced logging with threat detection
    advancedThreatDetectionService.logThreatDetection({
      type: event.type,
      severity: event.severity,
      details: event.details,
      source: event.source
    });

    // Additional processing based on event type
    switch (event.type) {
      case 'threat_detected':
        handleThreatDetection(event);
        break;
      case 'data_breach':
        handleDataBreachAttempt(event);
        break;
      case 'suspicious_activity':
        handleSuspiciousActivity(event);
        break;
      case 'session_anomaly':
        handleSessionAnomaly(event);
        break;
    }
  }, []);

  const analyzePayloadSecurity = useCallback((payload: string) => {
    // Threat detection analysis
    const threatAnalysis = advancedThreatDetectionService.analyzePayload(payload);
    
    if (threatAnalysis.threats.length > 0) {
      logSecurityEvent({
        type: 'threat_detected',
        severity: 'high',
        details: {
          threats: threatAnalysis.threats,
          riskScore: threatAnalysis.riskScore,
          payload: payload.substring(0, 100) // Log only first 100 chars
        },
        timestamp: Date.now(),
        source: 'payload_analysis'
      });
    }

    // PII detection
    const piiDetection = dataProtectionService.detectPII(payload);
    
    if (piiDetection.hasPII) {
      logSecurityEvent({
        type: 'data_breach',
        severity: 'critical',
        details: {
          piiTypes: piiDetection.piiTypes,
          confidence: piiDetection.confidence,
          redactedData: piiDetection.redactedData
        },
        timestamp: Date.now(),
        source: 'pii_detection'
      });
    }

    return {
      threats: threatAnalysis.threats,
      hasPII: piiDetection.hasPII,
      riskScore: threatAnalysis.riskScore
    };
  }, [logSecurityEvent]);

  const monitorSessionSecurity = useCallback((sessionId: string, activity: any) => {
    const validation = enhancedSessionSecurityService.validateSessionActivity(sessionId, activity);
    
    if (!validation.isValid || validation.riskLevel === 'high') {
      logSecurityEvent({
        type: 'session_anomaly',
        severity: validation.riskLevel === 'high' ? 'critical' : 'medium',
        details: {
          sessionId,
          riskLevel: validation.riskLevel,
          actions: validation.actions,
          activity
        },
        timestamp: Date.now(),
        source: 'session_monitoring'
      });
    }

    return validation;
  }, [logSecurityEvent]);

  const validateContentSecurity = useCallback((url: string, resourceType: string) => {
    const isValid = securityHeadersService.validateCSP(url, resourceType);
    
    if (!isValid) {
      logSecurityEvent({
        type: 'compliance_violation',
        severity: 'medium',
        details: {
          url,
          resourceType,
          violation: 'CSP_VIOLATION'
        },
        timestamp: Date.now(),
        source: 'csp_validation'
      });
    }

    return isValid;
  }, [logSecurityEvent]);

  const getSecurityMetrics = useCallback((): SecurityMetrics => {
    const sessionStats = enhancedSessionSecurityService.getSecurityStats();
    const securityScore = securityHeadersService.getSecurityScore();

    return {
      threatCount: sessionStats.suspiciousSessions,
      dataBreachAttempts: 0, // Would be tracked from actual events
      sessionAnomalies: sessionStats.highRiskSessions,
      complianceViolations: 0, // Would be tracked from compliance monitoring
      securityScore: securityScore.score
    };
  }, []);

  // Enhanced security monitoring effects
  useEffect(() => {
    // Monitor for CSP violations
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      securityHeadersService.reportCSPViolation({
        documentUri: event.documentURI,
        violatedDirective: event.violatedDirective,
        blockedUri: event.blockedURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber
      });

      logSecurityEvent({
        type: 'compliance_violation',
        severity: 'high',
        details: {
          violatedDirective: event.violatedDirective,
          blockedUri: event.blockedURI,
          sourceFile: event.sourceFile
        },
        timestamp: Date.now(),
        source: 'csp_violation'
      });
    };

    // Monitor for security policy violations
    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    // Monitor for potential XSS attacks via error events
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('script')) {
        const analysis = advancedThreatDetectionService.analyzePayload(event.message);
        
        if (analysis.riskScore > 30) {
          logSecurityEvent({
            type: 'threat_detected',
            severity: 'high',
            details: {
              message: event.message,
              filename: event.filename,
              threats: analysis.threats,
              riskScore: analysis.riskScore
            },
            timestamp: Date.now(),
            source: 'error_monitoring'
          });
        }
      }
    };

    window.addEventListener('error', handleError);

    // Monitor for suspicious network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      
      // Analyze request for threats
      const analysis = advancedThreatDetectionService.analyzeRequestBehavior({
        endpoint: url,
        method: args[1]?.method || 'GET',
        payloadSize: JSON.stringify(args[1]?.body || '').length,
        responseTime: Date.now(),
        userAgent: navigator.userAgent,
        ipAddress: 'unknown' // Would need backend support to get real IP
      });

      if (analysis.riskScore > 50) {
        logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          details: {
            url,
            riskScore: analysis.riskScore,
            threatType: analysis.threatType,
            recommendations: analysis.recommendations
          },
          timestamp: Date.now(),
          source: 'network_monitoring'
        });
      }

      return originalFetch(...args);
    };

    // Initialize session security monitoring
    enhancedSessionSecurityService.startCleanupTimer();

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
      window.removeEventListener('error', handleError);
      window.fetch = originalFetch;
    };
  }, [logSecurityEvent]);

  // Helper functions for event handling
  const handleThreatDetection = (event: SecurityEvent) => {
    // Could implement automatic blocking or alerting
    logger.warn('Threat detected and logged', event.details);
  };

  const handleDataBreachAttempt = (event: SecurityEvent) => {
    // Could implement data sanitization or user notification
    logger.error('Data breach attempt detected', event.details);
  };

  const handleSuspiciousActivity = (event: SecurityEvent) => {
    // Could implement rate limiting or user verification
    logger.warn('Suspicious activity detected', event.details);
  };

  const handleSessionAnomaly = (event: SecurityEvent) => {
    // Could implement session termination or step-up authentication
    logger.warn('Session anomaly detected', event.details);
  };

  return {
    logSecurityEvent,
    analyzePayloadSecurity,
    monitorSessionSecurity,
    validateContentSecurity,
    getSecurityMetrics
  };
};