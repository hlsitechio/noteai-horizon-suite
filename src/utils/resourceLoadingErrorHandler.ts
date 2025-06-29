
/**
 * Resource Loading Error Handler
 * Manages failed resource loading and provides statistics
 */

interface FailedResource {
  url: string;
  type: string;
  timestamp: Date;
  error: string;
}

class ResourceLoadingErrorManager {
  private failedResources: FailedResource[] = [];

  constructor() {
    this.setupErrorListeners();
  }

  private setupErrorListeners() {
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        const resource: FailedResource = {
          url: (target as any).src || (target as any).href || 'unknown',
          type: target.tagName.toLowerCase(),
          timestamp: new Date(),
          error: event.message || 'Loading failed'
        };
        this.failedResources.push(resource);
      }
    }, true);
  }

  getFailedResources() {
    return this.failedResources;
  }

  clearFailedResources() {
    this.failedResources = [];
  }

  getStats() {
    const byType = this.failedResources.reduce((acc, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.failedResources.length,
      byType
    };
  }
}

export const resourceLoadingErrorManager = new ResourceLoadingErrorManager();
