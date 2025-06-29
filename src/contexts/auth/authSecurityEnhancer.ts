
/**
 * Authentication Security Enhancer - Implements security best practices
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  sessionTimeout: number;
}

class AuthSecurityEnhancer {
  private config: SecurityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 12,
    requireSpecialChars: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  };

  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private lastActivity = Date.now();
  private sessionTimeoutId: NodeJS.Timeout | null = null;

  initialize() {
    this.setupSessionTimeout();
    this.setupActivityTracking();
    this.setupSecurityHeaders();
    console.log('🔐 Authentication security enhancer initialized');
  }

  private setupSessionTimeout() {
    // Reset session timeout on activity
    const resetTimeout = () => {
      this.lastActivity = Date.now();
      
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
      }
      
      this.sessionTimeoutId = setTimeout(() => {
        this.handleSessionTimeout();
      }, this.config.sessionTimeout);
    };

    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, resetTimeout, { passive: true });
    });

    resetTimeout();
  }

  private setupActivityTracking() {
    // Track session activity and warn before timeout
    setInterval(() => {
      const timeSinceActivity = Date.now() - this.lastActivity;
      const timeUntilTimeout = this.config.sessionTimeout - timeSinceActivity;
      
      if (timeUntilTimeout < 5 * 60 * 1000 && timeUntilTimeout > 4 * 60 * 1000) {
        toast.warning('Session will expire in 5 minutes due to inactivity', {
          duration: 10000,
        });
      }
    }, 60000); // Check every minute
  }

  private setupSecurityHeaders() {
    // Add security headers via meta tags
    const addSecurityMeta = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    addSecurityMeta('referrer', 'strict-origin-when-cross-origin');
    addSecurityMeta('robots', 'noindex, nofollow');
  }

  private async handleSessionTimeout() {
    console.log('🔐 Session timeout - logging out user');
    toast.error('Session expired due to inactivity', {
      duration: 5000,
    });
    
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.config.requireSpecialChars && !/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }

    if (/123|abc|qwe|password|admin|user/i.test(password)) {
      errors.push('Password cannot contain common sequences or words');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  checkLoginAttempts(email: string): { canAttempt: boolean; waitTime?: number } {
    const attempts = this.loginAttempts.get(email);
    
    if (!attempts) {
      return { canAttempt: true };
    }

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    
    if (attempts.count >= this.config.maxLoginAttempts) {
      if (timeSinceLastAttempt < this.config.lockoutDuration) {
        const waitTime = Math.ceil((this.config.lockoutDuration - timeSinceLastAttempt) / 1000 / 60);
        return { canAttempt: false, waitTime };
      } else {
        // Reset after lockout period
        this.loginAttempts.delete(email);
        return { canAttempt: true };
      }
    }

    return { canAttempt: true };
  }

  recordLoginAttempt(email: string, success: boolean) {
    if (success) {
      this.loginAttempts.delete(email);
      return;
    }

    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);

    if (attempts.count >= this.config.maxLoginAttempts) {
      toast.error(`Too many failed login attempts. Account locked for ${this.config.lockoutDuration / 60000} minutes.`);
    }
  }

  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  async checkSessionSecurity(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session security check failed:', error);
        return false;
      }

      if (!session) {
        return false;
      }

      // Check if session is about to expire
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry < 300) { // Less than 5 minutes
        console.log('🔐 Session expiring soon, refreshing...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Failed to refresh session:', refreshError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Session security check error:', error);
      return false;
    }
  }

  getSecurityStatus() {
    return {
      sessionActive: this.sessionTimeoutId !== null,
      lastActivity: this.lastActivity,
      loginAttempts: this.loginAttempts.size,
      config: this.config
    };
  }
}

export const authSecurityEnhancer = new AuthSecurityEnhancer();

// Auto-initialize
if (typeof window !== 'undefined') {
  authSecurityEnhancer.initialize();
  (window as any).authSecurity = authSecurityEnhancer;
}
