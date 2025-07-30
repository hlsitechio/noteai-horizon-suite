// Safe logging utility that prevents sensitive data exposure
// Only logs in development mode and sanitizes user data
// Enhanced with comprehensive security audit features

import { maskSensitiveData, securityAudit } from './securityAudit';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

const isDevelopment = import.meta.env.DEV;

/**
 * Enhanced sanitization using security audit system
 */
const sanitizeUserData = (data: any): any => {
  // Use the comprehensive security audit masking
  return maskSensitiveData(data);
};

/**
 * Safe console logging that only works in development
 */
export const safeLog = {
  info: (message: string, data?: LogData) => {
    if (isDevelopment) {
      const sanitizedData = data ? sanitizeUserData(data) : undefined;
      console.info(`[INFO] ${message}`, sanitizedData || '');
    }
  },
  
  warn: (message: string, data?: LogData) => {
    if (isDevelopment) {
      const sanitizedData = data ? sanitizeUserData(data) : undefined;
      console.warn(`[WARN] ${message}`, sanitizedData || '');
    }
  },
  
  error: (message: string, error?: Error | any) => {
    if (isDevelopment) {
      const sanitizedError = error ? sanitizeUserData(error) : undefined;
      console.error(`[ERROR] ${message}`, sanitizedError || '');
    }
  },
  
  debug: (message: string, data?: LogData) => {
    if (isDevelopment) {
      const sanitizedData = data ? sanitizeUserData(data) : undefined;
      console.debug(`[DEBUG] ${message}`, sanitizedData || '');
    }
  }
};

/**
 * Production-safe user ID logging
 */
export const logUserAction = (action: string, userId?: string) => {
  if (isDevelopment && userId) {
    // Only log first 8 characters of user ID in development
    const maskedId = userId.substring(0, 8) + '***';
    console.info(`[USER_ACTION] ${action} - User: ${maskedId}`);
  }
};

/**
 * Safe page navigation logging
 */
export const logPageNavigation = (from: string, to: string) => {
  if (isDevelopment) {
    console.info(`[NAVIGATION] ${from} → ${to}`);
  }
};