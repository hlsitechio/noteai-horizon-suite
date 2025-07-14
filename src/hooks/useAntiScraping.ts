import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { antiScrapingService } from '@/services/security/antiScrapingService';
import { useSecurityMonitoring } from './useSecurityMonitoring';

interface BrowserFingerprint {
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  javaEnabled?: boolean;
  webglSupported?: boolean;
  canvasFingerprint?: string;
}

export const useAntiScraping = () => {
  const { user } = useAuth();
  const { logSecurityEvent } = useSecurityMonitoring();
  const lastCheckTime = useRef<number>(0);
  const checkCount = useRef<number>(0);

  // Generate browser fingerprint
  const generateFingerprint = useCallback((): BrowserFingerprint => {
    const fingerprint: BrowserFingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
    };

    // Check for Java support (if available)
    try {
      fingerprint.javaEnabled = navigator.javaEnabled?.() || false;
    } catch {
      fingerprint.javaEnabled = false;
    }

    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      fingerprint.webglSupported = !!gl;
    } catch {
      fingerprint.webglSupported = false;
    }

    // Generate canvas fingerprint
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Anti-scraping fingerprint', 2, 2);
        fingerprint.canvasFingerprint = canvas.toDataURL();
      }
    } catch {
      fingerprint.canvasFingerprint = undefined;
    }

    return fingerprint;
  }, []);

  // Check for scraping behavior
  const checkForScraping = useCallback(async (endpoint?: string) => {
    const now = Date.now();
    checkCount.current++;

    // Rate limit our own checks to avoid false positives
    if (now - lastCheckTime.current < 1000) {
      return;
    }
    lastCheckTime.current = now;

    try {
      const fingerprint = generateFingerprint();
      const context = {
        userId: user?.id,
        ipAddress: undefined, // Will be detected on server-side
        userAgent: navigator.userAgent,
        endpoint: endpoint || window.location.pathname,
        method: 'GET'
      };

      const result = await antiScrapingService.checkForScraping(
        context,
        fingerprint,
        { headers: {} } // Basic request data
      );

      if (!result.allowed) {
        logSecurityEvent({
          eventType: 'anti_scraping_violation',
          severity: 'high',
          details: {
            reason: result.reason,
            action: result.action,
            endpoint: context.endpoint,
            checkCount: checkCount.current
          }
        });

        // In a real implementation, you might redirect to a CAPTCHA page
        // or show a security challenge
        if (result.action === 'block') {
          window.location.href = '/security-challenge';
        }
      } else if (result.action === 'monitor') {
        logSecurityEvent({
          eventType: 'anti_scraping_monitor',
          severity: 'medium',
          details: {
            reason: result.reason,
            endpoint: context.endpoint,
            checkCount: checkCount.current
          }
        });
      }
    } catch (error) {
      console.error('Anti-scraping check failed:', error);
    }
  }, [user, generateFingerprint, logSecurityEvent]);

  // Monitor page interactions
  useEffect(() => {
    let mouseMovements = 0;
    let keystrokes = 0;
    let scrollEvents = 0;
    let clickEvents = 0;

    const handleMouseMove = () => {
      mouseMovements++;
    };

    const handleKeydown = () => {
      keystrokes++;
    };

    const handleScroll = () => {
      scrollEvents++;
    };

    const handleClick = () => {
      clickEvents++;
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeydown, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    // Check for human-like behavior after 30 seconds
    const behaviorCheckTimer = setTimeout(() => {
      const totalInteractions = mouseMovements + keystrokes + scrollEvents + clickEvents;
      
      if (totalInteractions === 0) {
        logSecurityEvent({
          eventType: 'no_human_interaction',
          severity: 'medium',
          details: {
            timeSpent: 30000,
            interactions: 0,
            suspiciousReason: 'No user interactions detected'
          }
        });
      } else if (mouseMovements === 0 && keystrokes > 0) {
        logSecurityEvent({
          eventType: 'keyboard_only_interaction',
          severity: 'low',
          details: {
            keystrokes,
            mouseMovements,
            suspiciousReason: 'Only keyboard interactions detected'
          }
        });
      }
    }, 30000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      clearTimeout(behaviorCheckTimer);
    };
  }, [logSecurityEvent]);

  // Monitor for automation detection attempts
  useEffect(() => {
    // Check for common automation properties
    const automationIndicators = [];

    // Check for webdriver property
    if ('webdriver' in navigator && (navigator as any).webdriver) {
      automationIndicators.push('webdriver_detected');
    }

    // Check for automation-specific properties
    if ((window as any).callPhantom || (window as any)._phantom) {
      automationIndicators.push('phantom_js_detected');
    }

    if ((window as any).Buffer) {
      automationIndicators.push('nodejs_environment_detected');
    }

    // Check for missing properties that browsers should have
    if (!(window as any).chrome && navigator.userAgent.includes('Chrome')) {
      automationIndicators.push('missing_chrome_object');
    }

    // Check for suspicious property modifications
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
      if (this === navigator.webdriver) {
        automationIndicators.push('webdriver_toString_override');
      }
      return originalToString.apply(this, arguments as any);
    };

    if (automationIndicators.length > 0) {
      logSecurityEvent({
        eventType: 'automation_detected',
        severity: 'high',
        details: {
          indicators: automationIndicators,
          userAgent: navigator.userAgent
        }
      });
    }

    return () => {
      Function.prototype.toString = originalToString;
    };
  }, [logSecurityEvent]);

  // Monitor for rapid page navigation (scraping pattern)
  useEffect(() => {
    let navigationCount = 0;
    const navigationTimes: number[] = [];

    const handleNavigation = () => {
      navigationCount++;
      navigationTimes.push(Date.now());

      // Keep only last 10 navigations
      if (navigationTimes.length > 10) {
        navigationTimes.shift();
      }

      // Check for rapid navigation pattern
      if (navigationTimes.length >= 5) {
        const timeDiffs = [];
        for (let i = 1; i < navigationTimes.length; i++) {
          timeDiffs.push(navigationTimes[i] - navigationTimes[i-1]);
        }

        const avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        
        // If average time between navigations is less than 2 seconds
        if (avgTime < 2000) {
          logSecurityEvent({
            eventType: 'rapid_navigation_pattern',
            severity: 'high',
            details: {
              navigationCount,
              averageInterval: avgTime,
              suspiciousReason: 'Rapid page navigation suggests automated behavior'
            }
          });
        }
      }
    };

    // Listen for page visibility changes and navigation using modern events
    document.addEventListener('visibilitychange', handleNavigation);
    window.addEventListener('pagehide', handleNavigation);

    return () => {
      document.removeEventListener('visibilitychange', handleNavigation);
      window.removeEventListener('pagehide', handleNavigation);
    };
  }, [logSecurityEvent]);

  // Perform initial check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForScraping();
    }, 2000); // Wait 2 seconds after page load

    return () => clearTimeout(timer);
  }, [checkForScraping]);

  // Add honeypot elements
  useEffect(() => {
    // Create invisible honeypot elements that bots might interact with
    const honeypot1 = document.createElement('div');
    honeypot1.style.position = 'absolute';
    honeypot1.style.left = '-9999px';
    honeypot1.style.top = '-9999px';
    honeypot1.innerHTML = '<a href="/api/secret-data">Download All Data</a>';
    honeypot1.id = 'honeypot-1';

    const honeypot2 = document.createElement('input');
    honeypot2.type = 'text';
    honeypot2.name = 'website';
    honeypot2.style.display = 'none';
    honeypot2.tabIndex = -1;
    honeypot2.autocomplete = 'off';

    document.body.appendChild(honeypot1);
    document.body.appendChild(honeypot2);

    // Monitor honeypot interactions
    const handleHoneypotClick = (e: Event) => {
      e.preventDefault();
      logSecurityEvent({
        eventType: 'honeypot_interaction',
        severity: 'critical',
        details: {
          honeypotType: 'link',
          element: 'secret-data-link',
          suspiciousReason: 'Bot clicked on hidden honeypot link'
        }
      });
    };

    const handleHoneypotInput = () => {
      logSecurityEvent({
        eventType: 'honeypot_interaction',
        severity: 'critical',
        details: {
          honeypotType: 'input',
          element: 'hidden-form-field',
          suspiciousReason: 'Bot filled hidden form field'
        }
      });
    };

    honeypot1.addEventListener('click', handleHoneypotClick);
    honeypot2.addEventListener('input', handleHoneypotInput);

    return () => {
      honeypot1.removeEventListener('click', handleHoneypotClick);
      honeypot2.removeEventListener('input', handleHoneypotInput);
      document.body.removeChild(honeypot1);
      document.body.removeChild(honeypot2);
    };
  }, [logSecurityEvent]);

  return {
    checkForScraping,
    addHoneypot: antiScrapingService.addHoneypot.bind(antiScrapingService),
    getStats: antiScrapingService.getStats.bind(antiScrapingService)
  };
};
