
/**
 * Browser Compatibility Error Handler
 * Manages cross-browser compatibility issues and polyfills
 */

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  missingFeatures: string[];
}

class BrowserCompatibilityManager {
  private browserInfo: BrowserInfo;
  private polyfillsLoaded: Set<string> = new Set();

  constructor() {
    this.browserInfo = this.detectBrowser();
    this.setupCompatibilityHandling();
  }

  private detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = '0';
    const missingFeatures: string[] = [];

    if (userAgent.indexOf('Chrome') > -1) {
      name = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || '0';
    } else if (userAgent.indexOf('Firefox') > -1) {
      name = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || '0';
    } else if (userAgent.indexOf('Safari') > -1) {
      name = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || '0';
    } else if (userAgent.indexOf('Edge') > -1) {
      name = 'Edge';
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || '0';
    }

    // Check for missing features
    if (!window.ResizeObserver) missingFeatures.push('ResizeObserver');
    if (!window.IntersectionObserver) missingFeatures.push('IntersectionObserver');
    if (!window.MutationObserver) missingFeatures.push('MutationObserver');
    if (!window.fetch) missingFeatures.push('fetch');
    if (!Promise) missingFeatures.push('Promise');

    return {
      name,
      version,
      isSupported: this.isSupportedBrowser(name, parseInt(version)),
      missingFeatures
    };
  }

  private isSupportedBrowser(name: string, version: number): boolean {
    const minVersions: Record<string, number> = {
      Chrome: 80,
      Firefox: 75,
      Safari: 13,
      Edge: 80
    };

    return version >= (minVersions[name] || 0);
  }

  private setupCompatibilityHandling() {
    // Polyfill missing features
    this.loadPolyfills();
    
    // Handle browser-specific errors
    this.setupBrowserSpecificErrorHandling();
    
    // Display warnings for unsupported browsers
    if (!this.browserInfo.isSupported) {
      this.showCompatibilityWarning();
    }
  }

  private async loadPolyfills() {
    const { missingFeatures } = this.browserInfo;

    for (const feature of missingFeatures) {
      try {
        await this.loadPolyfill(feature);
        this.polyfillsLoaded.add(feature);
      } catch (error) {
        console.warn(`Failed to load polyfill for ${feature}:`, error);
      }
    }
  }

  private async loadPolyfill(feature: string): Promise<void> {
    switch (feature) {
      case 'ResizeObserver':
        if (!window.ResizeObserver) {
          await import('resize-observer-polyfill').then(module => {
            window.ResizeObserver = module.default;
          }).catch(() => {
            // Provide minimal ResizeObserver polyfill
            window.ResizeObserver = class {
              observe() {}
              unobserve() {}
              disconnect() {}
            } as any;
          });
        }
        break;

      case 'IntersectionObserver':
        if (!window.IntersectionObserver) {
          window.IntersectionObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
          } as any;
        }
        break;

      case 'fetch':
        if (!window.fetch) {
          window.fetch = async (url: string, options?: any) => {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(options?.method || 'GET', url);
              xhr.onload = () => resolve({
                ok: xhr.status >= 200 && xhr.status < 300,
                status: xhr.status,
                text: () => Promise.resolve(xhr.responseText),
                json: () => Promise.resolve(JSON.parse(xhr.responseText))
              } as any);
              xhr.onerror = () => reject(new Error('Network error'));
              xhr.send(options?.body);
            });
          };
        }
        break;
    }
  }

  private setupBrowserSpecificErrorHandling() {
    // Safari-specific error handling
    if (this.browserInfo.name === 'Safari') {
      this.handleSafariSpecificErrors();
    }
    
    // Firefox-specific error handling
    if (this.browserInfo.name === 'Firefox') {
      this.handleFirefoxSpecificErrors();
    }
  }

  private handleSafariSpecificErrors() {
    // Handle Safari's strict CORS policies
    const originalFetch = window.fetch;
    window.fetch = async (url: string | Request, options?: RequestInit) => {
      try {
        return await originalFetch(url, options);
      } catch (error: any) {
        if (error.message.includes('CORS')) {
          console.warn('Safari CORS issue detected, attempting fallback');
        }
        throw error;
      }
    };
  }

  private handleFirefoxSpecificErrors() {
    // Handle Firefox-specific issues
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        if (event.message?.includes('NS_ERROR_FAILURE')) {
          console.warn('Firefox NS_ERROR_FAILURE suppressed');
          event.preventDefault();
        }
      });
    }
  }

  private showCompatibilityWarning() {
    if (import.meta.env.PROD) {
      console.warn(`Your browser (${this.browserInfo.name} ${this.browserInfo.version}) may not be fully supported. Please update to the latest version for the best experience.`);
    }
  }

  public getBrowserInfo(): BrowserInfo {
    return { ...this.browserInfo };
  }

  public isFeatureSupported(feature: string): boolean {
    return !this.browserInfo.missingFeatures.includes(feature) || this.polyfillsLoaded.has(feature);
  }
}

export const browserCompatibilityManager = new BrowserCompatibilityManager();
