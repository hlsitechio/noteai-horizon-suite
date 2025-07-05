
/**
 * Service to clean up any problematic third-party integrations
 */

export class CleanupService {
  static initialize() {
    // Remove any Firebase/Firestore listeners that might be causing permission errors
    this.cleanupFirebase();
    
    // Prevent problematic window operations
    this.preventProblematicWindowOps();
    
    // Rate limit cleanup
    this.setupRateLimitCleanup();
  }

  private static cleanupFirebase() {
    // Check if there are any Firebase references and clean them up
    if (typeof window !== 'undefined') {
      // Remove any Firebase listeners
      try {
        // Clear any existing Firebase app instances
        if ((window as any).firebase) {
          console.log('Cleaning up Firebase instances');
          delete (window as any).firebase;
        }
        
        // Clear Firestore instances
        if ((window as any).firestore) {
          console.log('Cleaning up Firestore instances');
          delete (window as any).firestore;
        }
      } catch (error) {
        console.warn('Error cleaning up Firebase:', error);
      }
    }
  }

  private static preventProblematicWindowOps() {
    // Override potentially problematic window operations in development
    if (import.meta.env.DEV) {
      const originalClose = window.close;
      window.close = function() {
        console.warn('window.close() called - this might cause COOP errors');
        // Don't actually close in development
        return;
      };
      
      // Store original for cleanup
      (window as any)._originalClose = originalClose;
    }
  }

  private static setupRateLimitCleanup() {
    // Clear any existing intervals that might be causing 429 errors
    const intervalId = setInterval(() => {}, 9999);
    clearInterval(intervalId);
    
    // Cast to number for browser compatibility
    const maxId = Number(intervalId);
    
    for (let i = 1; i < maxId; i++) {
      clearInterval(i);
      clearTimeout(i);
    }
    
    console.log('Cleared existing intervals and timeouts to prevent rate limiting');
  }

  static cleanup() {
    // Restore original window methods
    if ((window as any)._originalClose) {
      window.close = (window as any)._originalClose;
      delete (window as any)._originalClose;
    }
  }
}
