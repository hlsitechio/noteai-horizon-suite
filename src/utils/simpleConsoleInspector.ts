/**
 * Simple Console Inspector - Clean approach for debugging
 * Run: window.inspectConsole() in DevTools to get a clean summary
 */

interface SimpleConsoleMessage {
  level: 'error' | 'warn' | 'info' | 'log';
  message: string;
  count: number;
  timestamp: number;
}

class SimpleConsoleInspector {
  private messages: SimpleConsoleMessage[] = [];
  private isActive = false;

  start() {
    if (this.isActive) return;
    this.isActive = true;
    
    // Only capture errors and warnings - not all console noise
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      originalError(...args);
      this.addMessage('error', args);
    };
    
    console.warn = (...args) => {
      originalWarn(...args);
      this.addMessage('warn', args);
    };
    
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.addMessage('error', [event.message], `${event.filename}:${event.lineno}`);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.addMessage('error', [event.reason]);
    });
  }

  private addMessage(level: 'error' | 'warn', args: any[], source?: string) {
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(' ');
    
    // Check if we already have this message
    const existing = this.messages.find(m => m.message === message && m.level === level);
    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
    } else {
      this.messages.push({
        level,
        message: source ? `${message} (${source})` : message,
        count: 1,
        timestamp: Date.now()
      });
    }
  }

  getReport() {
    const errors = this.messages.filter(m => m.level === 'error');
    const warnings = this.messages.filter(m => m.level === 'warn');
    
    console.clear();
    console.log('🔍 CONSOLE INSPECTION REPORT');
    console.log('================================');
    console.log(`📊 Summary: ${errors.length} error types, ${warnings.length} warning types`);
    console.log(`🕒 Report generated: ${new Date().toLocaleTimeString()}`);
    console.log('');
    
    if (errors.length > 0) {
      console.log('❌ ERRORS:');
      errors.forEach((msg, i) => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        console.log(`${i + 1}. [${time}] ${msg.message} ${msg.count > 1 ? `(×${msg.count})` : ''}`);
      });
      console.log('');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach((msg, i) => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        console.log(`${i + 1}. [${time}] ${msg.message} ${msg.count > 1 ? `(×${msg.count})` : ''}`);
      });
      console.log('');
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ No errors or warnings detected!');
    }
    
    console.log('================================');
    console.log('💡 Run window.inspectConsole() again to refresh');
    
    return {
      errors: errors.length,
      warnings: warnings.length,
      messages: this.messages
    };
  }

  clear() {
    this.messages = [];
    console.log('🧹 Console inspection data cleared');
  }
}

const inspector = new SimpleConsoleInspector();
inspector.start();

// Global access
if (typeof window !== 'undefined') {
  (window as any).inspectConsole = () => inspector.getReport();
  (window as any).clearConsoleInspection = () => inspector.clear();
}

export { inspector };