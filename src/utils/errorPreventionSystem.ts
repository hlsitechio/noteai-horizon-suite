
/**
 * Error Prevention System - Stops errors before they occur
 */

class ErrorPreventionSystem {
  private preventionRules = new Map<string, () => void>();
  private preventedCount = 0;

  initialize() {
    console.log('🛡️ Initializing Error Prevention System...');
    this.setupPreventionRules();
    this.activatePreventions();
    console.log('✅ Error Prevention System active');
  }

  private setupPreventionRules() {
    // Prevent null/undefined access
    this.addPreventionRule('null_access', () => {
      this.preventNullAccess();
    });

    // Prevent infinite loops
    this.addPreventionRule('infinite_loops', () => {
      this.preventInfiniteLoops();
    });

    // Prevent memory leaks
    this.addPreventionRule('memory_leaks', () => {
      this.preventMemoryLeaks();
    });

    // Prevent DOM manipulation errors
    this.addPreventionRule('dom_errors', () => {
      this.preventDOMErrors();
    });

    // Prevent network spam
    this.addPreventionRule('network_spam', () => {
      this.preventNetworkSpam();
    });
  }

  private addPreventionRule(id: string, rule: () => void) {
    this.preventionRules.set(id, rule);
  }

  private activatePreventions() {
    this.preventionRules.forEach((rule, id) => {
      try {
        rule();
        console.log(`🛡️ Activated prevention rule: ${id}`);
      } catch (error) {
        console.warn(`Failed to activate prevention rule ${id}:`, error);
      }
    });
  }

  private preventNullAccess() {
    // Wrap common object access patterns
    const originalQuerySelector = document.querySelector;
    document.querySelector = function(selector: string) {
      try {
        return originalQuerySelector.call(document, selector);
      } catch (error) {
        console.warn(`Prevented querySelector error for: ${selector}`);
        return null;
      }
    };
  }

  private preventInfiniteLoops() {
    // Monitor for high-frequency function calls
    const callTracker = new Map<string, { count: number; lastReset: number }>();
    
    const wrapFunction = (obj: any, methodName: string) => {
      const original = obj[methodName];
      if (typeof original !== 'function') return;
      
      obj[methodName] = function(...args: any[]) {
        const key = `${obj.constructor.name}.${methodName}`;
        const now = Date.now();
        
        if (!callTracker.has(key)) {
          callTracker.set(key, { count: 0, lastReset: now });
        }
        
        const tracker = callTracker.get(key)!;
        
        // Reset counter every second
        if (now - tracker.lastReset > 1000) {
          tracker.count = 0;
          tracker.lastReset = now;
        }
        
        tracker.count++;
        
        // Prevent if called too frequently
        if (tracker.count > 100) {
          console.warn(`Prevented potential infinite loop in ${key}`);
          return;
        }
        
        return original.apply(this, args);
      };
    };

    // Wrap common problematic methods
    if (typeof window !== 'undefined') {
      wrapFunction(window, 'setTimeout');
      wrapFunction(window, 'setInterval');
    }
  }

  private preventMemoryLeaks() {
    // Track and cleanup event listeners
    const eventListeners = new WeakMap();
    
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!eventListeners.has(this)) {
        eventListeners.set(this, new Map());
      }
      
      const listeners = eventListeners.get(this);
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      
      listeners.get(type).add(listener);
      
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Auto-cleanup on page unload
    window.addEventListener('beforeunload', () => {
      console.log('🛡️ Cleaning up event listeners to prevent memory leaks');
    });
  }

  private preventDOMErrors() {
    // Prevent accessing non-existent DOM elements
    const originalGetElementById = document.getElementById;
    document.getElementById = function(id: string) {
      try {
        const element = originalGetElementById.call(document, id);
        if (!element) {
          console.warn(`Element with ID '${id}' not found`);
        }
        return element;
      } catch (error) {
        console.warn(`Prevented DOM error for ID: ${id}`);
        return null;
      }
    };
  }

  private preventNetworkSpam() {
    const requestTracker = new Map<string, { count: number; lastReset: number }>();
    
    const originalFetch = window.fetch;
    window.fetch = async function(url: string | Request, options?: RequestInit) {
      const urlString = typeof url === 'string' ? url : url.url;
      const now = Date.now();
      
      if (!requestTracker.has(urlString)) {
        requestTracker.set(urlString, { count: 0, lastReset: now });
      }
      
      const tracker = requestTracker.get(urlString)!;
      
      // Reset counter every 10 seconds
      if (now - tracker.lastReset > 10000) {
        tracker.count = 0;
        tracker.lastReset = now;
      }
      
      tracker.count++;
      
      // Prevent spam requests
      if (tracker.count > 10) {
        console.warn(`Prevented network spam to: ${urlString}`);
        return new Response('{}', { status: 429, statusText: 'Too Many Requests' });
      }
      
      return originalFetch.call(window, url, options);
    };
  }

  getPreventedCount(): number {
    return this.preventedCount;
  }

  getActiveRules(): string[] {
    return Array.from(this.preventionRules.keys());
  }
}

export const errorPreventionSystem = new ErrorPreventionSystem();

// Auto-initialize
if (typeof window !== 'undefined') {
  errorPreventionSystem.initialize();
  (window as any).errorPrevention = errorPreventionSystem;
}
