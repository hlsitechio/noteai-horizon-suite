/**
 * Error System Debugger
 * Provides debugging capabilities for the error handling system
 */

interface DebugStat {
  timestamp: Date;
  type: string;
  message: string;
  data?: any;
}

class ErrorSystemDebugger {
  private stats: DebugStat[] = [];
  private isDebugging = false;
  private maxStats = 1000;

  startDebugging() {
    this.isDebugging = true;
    console.log('🐛 Error system debugging started');
  }

  stopDebugging() {
    this.isDebugging = false;
    console.log('🐛 Error system debugging stopped');
  }

  log(type: string, message: string, data?: any) {
    if (!this.isDebugging) return;

    const stat: DebugStat = {
      timestamp: new Date(),
      type,
      message,
      data
    };

    this.stats.push(stat);

    // Keep only recent stats
    if (this.stats.length > this.maxStats) {
      this.stats = this.stats.slice(-this.maxStats);
    }

    console.log(`🐛 [${type}] ${message}`, data);
  }

  getStats(): DebugStat[] {
    return this.stats;
  }

  getCurrentHealth() {
    return {
      isDebugging: this.isDebugging,
      statCount: this.stats.length,
      memoryUsage: this.stats.length * 100 // Rough estimate
    };
  }

  clearStats() {
    this.stats = [];
  }
}

export const errorSystemDebugger = new ErrorSystemDebugger();
