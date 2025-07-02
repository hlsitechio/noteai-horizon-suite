
/**
 * Chrome Extension Conflict Handler
 * Manages conflicts and errors caused by browser extensions
 */

interface ExtensionConflict {
  extensionId?: string;
  extensionName?: string;
  conflictType: 'script_injection' | 'dom_modification' | 'network_interference' | 'event_blocking';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

class ChromeExtensionConflictManager {
  private knownConflicts: Map<string, ExtensionConflict> = new Map();
  private extensionPatterns: RegExp[] = [];
  private conflictResolutions: Map<string, () => void> = new Map();

  constructor() {
    this.setupExtensionDetection();
    this.setupConflictPatterns();
    this.setupConflictResolutions();
  }

  private setupExtensionDetection() {
    // Detect extension-related errors
    window.addEventListener('error', (event) => {
      if (this.isExtensionError(event)) {
        this.handleExtensionConflict(event);
      }
    });

    // Monitor DOM mutations that might be extension-related
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement && this.isExtensionElement(node)) {
                this.handleExtensionDOMModification(node);
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  private setupConflictPatterns() {
    this.extensionPatterns = [
      /chrome-extension:/i,
      /moz-extension:/i,
      /webkit-masked-url:/i,
      /extension\s+context\s+invalidated/i,
      /grammarly/i,
      /adblock/i,
      /lastpass/i,
      /honey/i,
      /metamask/i,
      /chrome\.runtime/i,
    ];
  }

  private setupConflictResolutions() {
    // Common extension conflict resolutions
    this.conflictResolutions.set('grammarly_conflict', () => {
      // Disable Grammarly on specific elements
      document.querySelectorAll('[data-gramm]').forEach(el => {
        el.removeAttribute('data-gramm');
        (el as any).dataset.grammDisable = 'true';
      });
    });

    this.conflictResolutions.set('adblock_resource_block', () => {
      // Handle AdBlock resource blocking
      console.warn('AdBlock detected blocking resources, implementing fallbacks');
    });

    this.conflictResolutions.set('extension_script_injection', () => {
      // Handle script injection conflicts
      this.cleanupExtensionScripts();
    });
  }

  private isExtensionError(event: ErrorEvent): boolean {
    const error = event.error || event.message;
    const errorStr = String(error);
    
    return this.extensionPatterns.some(pattern => pattern.test(errorStr)) ||
           this.extensionPatterns.some(pattern => pattern.test(event.filename || ''));
  }

  private isExtensionElement(element: HTMLElement): boolean {
    // Check for extension-injected elements
    const extensionAttributes = [
      'data-grammarly-part',
      'data-lastpass-element',
      'data-honey-extension',
      'data-adblock',
    ];

    return extensionAttributes.some(attr => element.hasAttribute(attr)) ||
           element.getAttribute('src')?.includes('chrome-extension') ||
           element.getAttribute('src')?.includes('moz-extension');
  }

  private handleExtensionConflict(event: ErrorEvent) {
    const conflictId = this.generateConflictId(event);
    
    if (this.knownConflicts.has(conflictId)) {
      return; // Already handling this conflict
    }

    const conflict: ExtensionConflict = {
      conflictType: this.determineConflictType(event),
      description: event.message || 'Unknown extension conflict',
      timestamp: new Date(),
      resolved: false
    };

    // Try to identify the extension
    this.identifyExtension(event, conflict);

    this.knownConflicts.set(conflictId, conflict);
    this.attemptConflictResolution(conflictId, conflict);

    // Suppress the error to prevent console spam
    event.preventDefault();
  }

  private handleExtensionDOMModification(element: HTMLElement) {
    // Handle extension DOM modifications that might interfere
    if (element.getAttribute('data-grammarly-part')) {
      this.resolveGrammarlyConflict(element);
    }
  }

  private determineConflictType(event: ErrorEvent): ExtensionConflict['conflictType'] {
    const errorStr = String(event.error || event.message);
    
    if (errorStr.includes('script') || errorStr.includes('injection')) {
      return 'script_injection';
    } else if (errorStr.includes('DOM') || errorStr.includes('element')) {
      return 'dom_modification';
    } else if (errorStr.includes('network') || errorStr.includes('fetch')) {
      return 'network_interference';
    } else {
      return 'event_blocking';
    }
  }

  private identifyExtension(event: ErrorEvent, conflict: ExtensionConflict) {
    const errorStr = String(event.error || event.message);
    
    if (errorStr.includes('grammarly')) {
      conflict.extensionName = 'Grammarly';
    } else if (errorStr.includes('adblock')) {
      conflict.extensionName = 'AdBlock';
    } else if (errorStr.includes('lastpass')) {
      conflict.extensionName = 'LastPass';
    } else if (errorStr.includes('honey')) {
      conflict.extensionName = 'Honey';
    } else if (errorStr.includes('metamask')) {
      conflict.extensionName = 'MetaMask';
    }
  }

  private generateConflictId(event: ErrorEvent): string {
    const errorStr = String(event.error || event.message);
    return btoa(errorStr).substring(0, 16);
  }

  private attemptConflictResolution(conflictId: string, conflict: ExtensionConflict) {
    const resolutionKey = `${conflict.extensionName?.toLowerCase() || 'generic'}_conflict`;
    const resolution = this.conflictResolutions.get(resolutionKey);

    if (resolution) {
      try {
        resolution();
        conflict.resolved = true;
        console.log(`Resolved extension conflict: ${conflict.description}`);
      } catch (error) {
        console.warn(`Failed to resolve extension conflict: ${error}`);
      }
    }
  }

  private resolveGrammarlyConflict(element: HTMLElement) {
    // Prevent Grammarly from interfering with our components
    element.setAttribute('data-gramm', 'false');
    element.setAttribute('spellcheck', 'false');
  }

  private cleanupExtensionScripts() {
    // Remove potentially problematic extension-injected scripts
    document.querySelectorAll('script[src*="chrome-extension"], script[src*="moz-extension"]').forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  }

  public getConflicts(): ExtensionConflict[] {
    return Array.from(this.knownConflicts.values());
  }

  public resolveConflict(conflictId: string): boolean {
    const conflict = this.knownConflicts.get(conflictId);
    if (conflict && !conflict.resolved) {
      this.attemptConflictResolution(conflictId, conflict);
      return conflict.resolved;
    }
    return false;
  }

  public addCustomResolution(extensionName: string, resolution: () => void) {
    this.conflictResolutions.set(`${extensionName.toLowerCase()}_conflict`, resolution);
  }

  public getStats() {
    const conflicts = Array.from(this.knownConflicts.values());
    return {
      totalConflicts: conflicts.length,
      resolvedConflicts: conflicts.filter(c => c.resolved).length,
      conflictsByType: conflicts.reduce((acc, conflict) => {
        acc[conflict.conflictType] = (acc[conflict.conflictType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const chromeExtensionConflictManager = new ChromeExtensionConflictManager();
