
/**
 * Resource Loading Error Handler
 * Manages failed resource loading (images, scripts, stylesheets)
 */

interface ResourceError {
  url: string;
  type: 'image' | 'script' | 'stylesheet' | 'font' | 'other';
  element: HTMLElement;
  timestamp: Date;
  retryCount: number;
  fallbackUsed: boolean;
}

class ResourceLoadingErrorManager {
  private failedResources: Map<string, ResourceError> = new Map();
  private fallbackResources: Map<string, string> = new Map();
  private maxRetries = 2;

  constructor() {
    this.setupResourceErrorHandling();
    this.setupFallbackResources();
  }

  private setupResourceErrorHandling() {
    // Capture resource loading errors
    window.addEventListener('error', (event) => {
      const target = event.target as HTMLElement;
      if (target && target !== window) {
        this.handleResourceError(target, event);
      }
    }, true);

    // Handle unhandled promise rejections that might be resource-related
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isResourceError(event.reason)) {
        this.handlePromiseResourceError(event);
      }
    });
  }

  private setupFallbackResources() {
    // Setup common fallback resources
    this.fallbackResources.set('image', '/placeholder.svg');
    this.fallbackResources.set('script', ''); // Scripts can't have meaningful fallbacks
    this.fallbackResources.set('stylesheet', ''); // Stylesheets will degrade gracefully
    this.fallbackResources.set('font', ''); // Fonts will fall back to system fonts
  }

  private handleResourceError(element: HTMLElement, event: ErrorEvent) {
    const url = this.getResourceUrl(element);
    if (!url) return;

    const type = this.getResourceType(element);
    const resourceKey = `${type}:${url}`;

    let resourceError = this.failedResources.get(resourceKey);
    if (!resourceError) {
      resourceError = {
        url,
        type,
        element,
        timestamp: new Date(),
        retryCount: 0,
        fallbackUsed: false
      };
      this.failedResources.set(resourceKey, resourceError);
    }

    resourceError.retryCount++;

    if (resourceError.retryCount <= this.maxRetries && !resourceError.fallbackUsed) {
      this.retryResourceLoad(resourceError);
    } else {
      this.applyFallback(resourceError);
    }

    // Prevent the error from propagating
    event.preventDefault();
  }

  private handlePromiseResourceError(event: PromiseRejectionEvent) {
    const error = event.reason;
    console.warn('Resource-related promise rejection:', error);
    
    // Try to extract URL from error
    const url = this.extractUrlFromError(error);
    if (url) {
      console.warn(`Failed to load resource: ${url}`);
    }
    
    // Prevent unhandled rejection
    event.preventDefault();
  }

  private getResourceUrl(element: HTMLElement): string | null {
    if (element instanceof HTMLImageElement) return element.src;
    if (element instanceof HTMLScriptElement) return element.src;
    if (element instanceof HTMLLinkElement) return element.href;
    if (element instanceof HTMLSourceElement) return element.src;
    return null;
  }

  private getResourceType(element: HTMLElement): ResourceError['type'] {
    if (element instanceof HTMLImageElement) return 'image';
    if (element instanceof HTMLScriptElement) return 'script';
    if (element instanceof HTMLLinkElement) {
      if (element.rel === 'stylesheet') return 'stylesheet';
      if (element.rel === 'preload' && element.as === 'font') return 'font';
    }
    return 'other';
  }

  private retryResourceLoad(resourceError: ResourceError) {
    console.warn(`Retrying resource load: ${resourceError.url} (attempt ${resourceError.retryCount})`);
    
    setTimeout(() => {
      const { element, url, type } = resourceError;
      
      if (type === 'image' && element instanceof HTMLImageElement) {
        element.src = url + '?retry=' + resourceError.retryCount;
      } else if (type === 'script' && element instanceof HTMLScriptElement) {
        element.src = url + '?retry=' + resourceError.retryCount;
      } else if (type === 'stylesheet' && element instanceof HTMLLinkElement) {
        element.href = url + '?retry=' + resourceError.retryCount;
      }
    }, 1000 * resourceError.retryCount); // Exponential backoff
  }

  private applyFallback(resourceError: ResourceError) {
    const { element, type, url } = resourceError;
    const fallbackUrl = this.fallbackResources.get(type);

    if (fallbackUrl && !resourceError.fallbackUsed) {
      console.warn(`Applying fallback for ${type}: ${url} -> ${fallbackUrl}`);
      
      if (type === 'image' && element instanceof HTMLImageElement) {
        element.src = fallbackUrl;
        element.alt = 'Image failed to load';
      }
      
      resourceError.fallbackUsed = true;
    } else {
      console.warn(`No fallback available for ${type}: ${url}`);
      this.hideFailedResource(element);
    }
  }

  private hideFailedResource(element: HTMLElement) {
    // Gracefully hide failed resources
    element.style.display = 'none';
    element.setAttribute('data-load-failed', 'true');
  }

  private isResourceError(error: any): boolean {
    if (typeof error === 'string') {
      return error.includes('Failed to load') || error.includes('net::ERR_');
    }
    if (error && error.message) {
      return error.message.includes('Failed to load') || error.message.includes('Loading');
    }
    return false;
  }

  private extractUrlFromError(error: any): string | null {
    if (typeof error === 'string') {
      const urlMatch = error.match(/https?:\/\/[^\s]+/);
      return urlMatch ? urlMatch[0] : null;
    }
    if (error && error.message) {
      const urlMatch = error.message.match(/https?:\/\/[^\s]+/);
      return urlMatch ? urlMatch[0] : null;
    }
    return null;
  }

  public addFallback(type: ResourceError['type'], fallbackUrl: string) {
    this.fallbackResources.set(type, fallbackUrl);
  }

  public getFailedResources(): ResourceError[] {
    return Array.from(this.failedResources.values());
  }

  public retryAllFailedResources() {
    for (const resourceError of this.failedResources.values()) {
      if (resourceError.retryCount < this.maxRetries) {
        this.retryResourceLoad(resourceError);
      }
    }
  }

  public clearFailedResources() {
    this.failedResources.clear();
  }

  public getStats() {
    const total = this.failedResources.size;
    const byType = Array.from(this.failedResources.values()).reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byType };
  }
}

export const resourceLoadingErrorManager = new ResourceLoadingErrorManager();
