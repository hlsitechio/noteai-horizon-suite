
/**
 * Browser Compatibility Handler
 * Detects browser capabilities and compatibility issues
 */

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: Record<string, boolean>;
}

class BrowserCompatibilityManager {
  private browserInfo: BrowserInfo;

  constructor() {
    this.browserInfo = this.detectBrowser();
  }

  private detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Chrome')) {
      name = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari')) {
      name = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edge')) {
      name = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    const features = {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      es6: typeof Symbol !== 'undefined',
      webgl: this.checkWebGLSupport()
    };

    const isSupported = this.checkBrowserSupport(name, version);

    return {
      name,
      version,
      isSupported,
      features
    };
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  private checkBrowserSupport(name: string, version: string): boolean {
    const minVersions: Record<string, number> = {
      Chrome: 60,
      Firefox: 55,
      Safari: 11,
      Edge: 79
    };

    const minVersion = minVersions[name];
    if (!minVersion) return false;

    const versionNum = parseInt(version, 10);
    return !isNaN(versionNum) && versionNum >= minVersion;
  }

  getBrowserInfo(): BrowserInfo {
    return this.browserInfo;
  }
}

export const browserCompatibilityManager = new BrowserCompatibilityManager();
