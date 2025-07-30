/**
 * CSP Monitoring Hook
 */

import { useEffect, useCallback } from 'react';
import { SecurityHeadersService } from '@/services/security/securityHeadersService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CSPViolationEvent extends Event {
  violatedDirective: string;
  blockedURI: string;
  documentURI: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  effectiveDirective: string;
  originalPolicy: string;
  sample?: string;
}

export const useCSPMonitoring = () => {
  const { toast } = useToast();
  const securityService = new SecurityHeadersService();

  const logViolation = useCallback(async (violation: CSPViolationEvent) => {
    // Log to security audit table
    try {
      await supabase.from('security_audit_logs').insert({
        event_type: 'CSP_VIOLATION',
        event_data: {
          violatedDirective: violation.violatedDirective,
          blockedURI: violation.blockedURI,
          documentURI: violation.documentURI,
          sourceFile: violation.sourceFile,
          lineNumber: violation.lineNumber,
          columnNumber: violation.columnNumber,
          effectiveDirective: violation.effectiveDirective,
          sample: violation.sample,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log CSP violation:', error);
    }

    // Show toast in development
    if (process.env.NODE_ENV === 'development') {
      toast({
        title: "CSP Violation Detected",
        description: `Blocked: ${violation.blockedURI}`,
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCSPViolation = useCallback((event: Event) => {
    const violation = event as CSPViolationEvent;
    
    // Filter out known acceptable violations
    const allowedViolations = [
      'chrome-extension:', // Browser extensions
      'safari-extension:', // Safari extensions
      'moz-extension:', // Firefox extensions
      'about:blank', // Blank iframes
      'data:text/html,chromewebdata' // Chrome internal
    ];

    if (allowedViolations.some(allowed => violation.blockedURI?.startsWith(allowed))) {
      return;
    }

    // Report violation to service
    securityService.reportCSPViolation({
      documentUri: violation.documentURI,
      violatedDirective: violation.violatedDirective,
      blockedUri: violation.blockedURI,
      sourceFile: violation.sourceFile,
      lineNumber: violation.lineNumber
    });

    // Log to our audit system
    logViolation(violation);
  }, [securityService, logViolation]);

  const enableReportOnlyMode = useCallback(() => {
    securityService.enableReportOnlyMode();
    toast({
      title: "CSP Report-Only Mode Enabled",
      description: "CSP violations will be logged but not blocked"
    });
  }, [securityService, toast]);

  const disableReportOnlyMode = useCallback(() => {
    securityService.disableReportOnlyMode();
    toast({
      title: "CSP Enforcement Mode Enabled",
      description: "CSP violations will be blocked"
    });
  }, [securityService, toast]);

  const getSecurityScore = useCallback(() => {
    return securityService.getSecurityScore();
  }, [securityService]);

  useEffect(() => {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    // Also listen for legacy CSP violation reports
    document.addEventListener('csp-violation', handleCSPViolation);

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
      document.removeEventListener('csp-violation', handleCSPViolation);
    };
  }, [handleCSPViolation]);

  return {
    enableReportOnlyMode,
    disableReportOnlyMode,
    getSecurityScore
  };
};