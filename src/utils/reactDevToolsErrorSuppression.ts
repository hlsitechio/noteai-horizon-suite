/**
 * React DevTools Error Suppression
 * Handles React-specific development errors and warnings
 */

// Type declarations for React DevTools
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      onCommitFiberRoot?: (id: any, root: any, ...args: any[]) => any;
    };
  }
}

interface ReactError {
  componentStack?: string;
  errorBoundary?: string;
  errorInfo?: any;
}

class ReactDevToolsErrorManager {
  private originalReactDevtoolsHook: any;
  private suppressedReactPatterns: RegExp[] = [];

  constructor() {
    this.setupReactSuppressionPatterns();
    this.interceptReactDevTools();
    this.setupReactErrorBoundaryEnhancement();
  }

  private setupReactSuppressionPatterns() {
    this.suppressedReactPatterns = [
      /Warning: Each child in a list should have a unique "key" prop/i,
      /Warning: Can't perform a React state update on an unmounted component/i,
      /Warning: componentWillMount has been renamed/i,
      /Warning: componentWillReceiveProps has been renamed/i,
      /Warning: componentWillUpdate has been renamed/i,
      /Warning: ReactDOM.render is no longer supported/i,
      /Warning: Failed prop type/i,
      /Warning: React does not recognize the .* prop on a DOM element/i,
      /Warning: Using UNSAFE_componentWillMount/i,
    ];
  }

  private interceptReactDevTools() {
    if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      this.originalReactDevtoolsHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      const originalOnCommitFiberRoot = this.originalReactDevtoolsHook.onCommitFiberRoot;
      if (originalOnCommitFiberRoot) {
        this.originalReactDevtoolsHook.onCommitFiberRoot = (id: any, root: any, ...args: any[]) => {
          try {
            return originalOnCommitFiberRoot.call(this.originalReactDevtoolsHook, id, root, ...args);
          } catch (error) {
            if (!this.shouldSuppressReactError(error)) {
              console.error('React DevTools Error:', error);
            }
          }
        };
      }
    }
  }

  private setupReactErrorBoundaryEnhancement() {
    // Enhance React Error Boundaries with better error handling
    if (typeof window !== 'undefined') {
      const originalAddEventListener = window.addEventListener;
      window.addEventListener = function(type: string, listener: any, options?: any) {
        if (type === 'error' || type === 'unhandledrejection') {
          const wrappedListener = (event: any) => {
            if (event.error && !reactDevToolsErrorManager.shouldSuppressReactError(event.error)) {
              return listener(event);
            }
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }
  }

  private shouldSuppressReactError(error: any): boolean {
    if (!error) return false;
    
    const message = error.message || String(error);
    return this.suppressedReactPatterns.some(pattern => pattern.test(message));
  }

  public handleReactError(error: Error, errorInfo: ReactError) {
    if (this.shouldSuppressReactError(error)) {
      if (import.meta.env.DEV) {
        console.log('Suppressed React Error:', error.message);
      }
      return;
    }

    console.error('React Error:', error, errorInfo);
  }

  public addReactSuppressionPattern(pattern: RegExp) {
    this.suppressedReactPatterns.push(pattern);
  }
}

export const reactDevToolsErrorManager = new ReactDevToolsErrorManager();
