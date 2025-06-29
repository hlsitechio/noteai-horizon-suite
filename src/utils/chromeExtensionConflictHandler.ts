
/**
 * Chrome Extension Conflict Handler
 * Detects and manages conflicts with browser extensions
 */

// Type declarations for Chrome API
declare global {
  interface Window {
    chrome?: {
      runtime?: any;
    };
  }
}

interface ExtensionConflict {
  type: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

class ChromeExtensionConflictManager {
  private conflicts: ExtensionConflict[] = [];

  constructor() {
    this.detectConflicts();
  }

  private detectConflicts() {
    // Detect common extension conflicts
    this.checkForAdBlockers();
    this.checkForScriptBlockers();
  }

  private checkForAdBlockers() {
    // Simple ad blocker detection
    const testElement = document.createElement('div');
    testElement.innerHTML = '&nbsp;';
    testElement.className = 'adsbox';
    document.body.appendChild(testElement);
    
    setTimeout(() => {
      if (testElement.offsetHeight === 0) {
        this.addConflict({
          type: 'ad_blocker',
          description: 'Ad blocker detected',
          timestamp: new Date(),
          resolved: false
        });
      }
      document.body.removeChild(testElement);
    }, 100);
  }

  private checkForScriptBlockers() {
    // Check for script blocking extensions
    if (typeof window !== 'undefined' && window.chrome?.runtime) {
      // Extension environment detected
      this.addConflict({
        type: 'extension_environment',
        description: 'Running in extension environment',
        timestamp: new Date(),
        resolved: false
      });
    }
  }

  private addConflict(conflict: ExtensionConflict) {
    this.conflicts.push(conflict);
  }

  getStats() {
    const conflictsByType = this.conflicts.reduce((acc, conflict) => {
      acc[conflict.type] = (acc[conflict.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalConflicts: this.conflicts.length,
      resolvedConflicts: this.conflicts.filter(c => c.resolved).length,
      conflictsByType
    };
  }
}

export const chromeExtensionConflictManager = new ChromeExtensionConflictManager();
