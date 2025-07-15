import { logger } from '../utils/logger';
import { OptimizedMessageService } from '../utils/optimizedMessageService';

interface CleanupTask {
  id: string;
  cleanup: () => void;
  priority: number;
}

export class OptimizedCleanupService {
  private static isInitialized = false;
  private static cleanupTasks: Map<string, CleanupTask> = new Map();
  private static readonly originalMethods: Map<string, any> = new Map();

  static initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize optimized message service
      OptimizedMessageService.initialize();
      
      // Minimal, targeted cleanup only for critical issues
      this.preventCriticalErrors();
      this.setupPageUnloadCleanup();
      
      this.isInitialized = true;
      logger.debug('✅ Optimized cleanup service initialized');
    } catch (error) {
      logger.error('Failed to initialize optimized cleanup service:', error);
    }
  }

  private static preventCriticalErrors() {
    // Only prevent window.close in development to avoid COOP errors
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      this.originalMethods.set('close', window.close);
      window.close = () => {
        logger.warn('window.close() prevented in development');
      };
    }
  }

  private static setupPageUnloadCleanup() {
    // Use a single event listener instead of multiple cleanup mechanisms
    const handleUnload = () => {
      this.executeAllCleanup();
    };

    // Use modern API with fallback
    if ('addEventListener' in window) {
      window.addEventListener('beforeunload', handleUnload, { once: true });
      window.addEventListener('pagehide', handleUnload, { once: true });
    }
  }

  static addCleanupTask(id: string, cleanup: () => void, priority: number = 0) {
    // Prevent duplicate tasks
    if (this.cleanupTasks.has(id)) {
      logger.warn(`Cleanup task ${id} already exists, skipping`);
      return;
    }

    this.cleanupTasks.set(id, { id, cleanup, priority });
  }

  static removeCleanupTask(id: string): boolean {
    return this.cleanupTasks.delete(id);
  }

  static addEventListenerWithCleanup(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): string {
    const id = `listener_${event}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    target.addEventListener(event, handler, options);
    
    this.addCleanupTask(id, () => {
      target.removeEventListener(event, handler, options);
    }, 10); // High priority for event listeners
    
    return id;
  }

  static addIntervalWithCleanup(callback: () => void, delay: number): string {
    const intervalId = setInterval(callback, delay);
    const id = `interval_${intervalId}`;
    
    this.addCleanupTask(id, () => {
      clearInterval(intervalId);
    }, 5);
    
    return id;
  }

  static addTimeoutWithCleanup(callback: () => void, delay: number): string {
    const timeoutId = setTimeout(callback, delay);
    const id = `timeout_${timeoutId}`;
    
    this.addCleanupTask(id, () => {
      clearTimeout(timeoutId);
    }, 5);
    
    return id;
  }

  private static executeAllCleanup() {
    if (this.cleanupTasks.size === 0) return;

    try {
      // Sort by priority (highest first) and execute
      const sortedTasks = Array.from(this.cleanupTasks.values())
        .sort((a, b) => b.priority - a.priority);

      for (const task of sortedTasks) {
        try {
          task.cleanup();
        } catch (error) {
          logger.error(`Error in cleanup task ${task.id}:`, error);
        }
      }

      this.cleanupTasks.clear();
      logger.debug(`✅ Executed ${sortedTasks.length} cleanup tasks`);
    } catch (error) {
      logger.error('Error during cleanup execution:', error);
    }
  }

  static cleanup() {
    // Cleanup message service
    OptimizedMessageService.cleanup();
    
    // Restore original methods
    for (const [method, original] of this.originalMethods) {
      if (method === 'close' && typeof window !== 'undefined') {
        window.close = original;
      }
    }

    this.executeAllCleanup();
    this.isInitialized = false;
  }
}