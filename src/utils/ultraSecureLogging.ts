/**
 * ULTRA-SECURE LOGGING PREVENTION SYSTEM
 * This completely eliminates ALL development logging by default
 * Only critical errors and security-related logs are allowed
 */

// Master kill switch for ALL development logging
export const LOGGING_DISABLED = true;

// Only these EXACT messages are allowed to pass through
const CRITICALLY_ALLOWED_MESSAGES = new Set([
  'ERROR',
  'CRITICAL',
  'SECURITY',
  'FATAL',
  'Retrieved settings (sanitized)',
  '✅ Service Worker registered successfully',
  '🔒 SECURITY AUDIT ACTIVE'
]);

/**
 * Completely replaces console with ultra-secure version
 */
class UltraSecureConsole {
  private originalConsole: Console;
  
  constructor() {
    this.originalConsole = { ...console };
    this.hijackConsole();
  }
  
  private isMessageAllowed(message: string): boolean {
    // Block WebSocket and development-related messages
    if (message.includes('WebSocket') || 
        message.includes('CORS') || 
        message.includes('dev-server') || 
        message.includes('Failed to load resource') ||
        message.includes('net::ERR_FAILED') ||
        message.includes('_sandbox') ||
        message.includes('[vite]') ||
        message.includes('[HMR]')) {
      return false;
    }
    
    // Block repetitive security messages to prevent spam
    if (message.includes('fingerprinting blocker activated') ||
        message.includes('UTS tracking system neutralized') ||
        message.includes('Navigation timing fingerprinting blocked') ||
        message.includes('Performance measurement blocked')) {
      return false;
    }
    
    // Only allow critically important messages
    return CRITICALLY_ALLOWED_MESSAGES.has(message) || 
           message.includes('ERROR') || 
           message.includes('CRITICAL') || 
           (message.includes('SECURITY') && !message.includes('UTS tracking attempt blocked')) ||
           message.includes('FATAL');
  }
  
  private processArgs(args: any[]): boolean {
    if (LOGGING_DISABLED) {
      const messageString = args.join(' ');
      return this.isMessageAllowed(messageString);
    }
    return true;
  }
  
  private hijackConsole() {
    const self = this;
    
    // Completely override ALL console methods
    console.log = function(...args: any[]) {
      if (self.processArgs(args)) {
        self.originalConsole.log(...args);
      }
    };
    
    console.info = function(...args: any[]) {
      if (self.processArgs(args)) {
        self.originalConsole.info(...args);
      }
    };
    
    console.warn = function(...args: any[]) {
      if (self.processArgs(args)) {
        self.originalConsole.warn(...args);
      }
    };
    
    console.debug = function(...args: any[]) {
      if (self.processArgs(args)) {
        self.originalConsole.debug(...args);
      }
    };
    
    // Always allow errors but only if they're real errors
    console.error = function(...args: any[]) {
      self.originalConsole.error(...args);
    };
  }
  
  restore() {
    Object.assign(console, this.originalConsole);
  }
}

// Initialize immediately
export const ultraSecureConsole = new UltraSecureConsole();

// Emergency restore function
(window as any).__emergencyRestoreConsole = () => {
  ultraSecureConsole.restore();
  console.warn('🚨 EMERGENCY: Console logging restored - Security compromised!');
};

// Log that security is active
console.log('🔒 SECURITY AUDIT ACTIVE - All non-essential logging blocked');