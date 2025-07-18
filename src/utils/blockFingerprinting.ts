/**
 * ULTRA-AGGRESSIVE FINGERPRINTING BLOCKER
 * Blocks all forms of tracking, fingerprinting, and data collection
 */

export const blockFingerprinting = () => {
  if (typeof window === 'undefined') return;

  // Block canvas fingerprinting
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType: string, ...args: any[]) {
    if (contextType === '2d' || contextType === 'webgl' || contextType === 'experimental-webgl') {
      console.warn('SECURITY: Canvas fingerprinting attempt blocked');
      return null;
    }
    return originalGetContext.apply(this, [contextType, ...args]);
  };

  // Block WebGL fingerprinting
  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
    // Block common fingerprinting parameters
    const blockedParams = [
      0x1F00, // GL_VENDOR
      0x1F01, // GL_RENDERER
      0x1F02, // GL_VERSION
      0x8B8C, // GL_SHADING_LANGUAGE_VERSION
    ];
    
    if (blockedParams.includes(parameter)) {
      console.warn('SECURITY: WebGL fingerprinting attempt blocked');
      return 'BLOCKED';
    }
    return originalGetParameter.call(this, parameter);
  };

  // Block audio fingerprinting
  const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
  AudioContext.prototype.createAnalyser = function() {
    console.warn('SECURITY: Audio fingerprinting attempt blocked');
    return null as any;
  };

  // Block font fingerprinting
  const originalOffscreenCanvas = (window as any).OffscreenCanvas;
  if (originalOffscreenCanvas) {
    (window as any).OffscreenCanvas = function() {
      console.warn('SECURITY: Font fingerprinting attempt blocked');
      return null;
    };
  }

  // Block navigation timing API abuse
  const originalGetEntriesByType = Performance.prototype.getEntriesByType;
  Performance.prototype.getEntriesByType = function(type: string) {
    if (type === 'navigation' || type === 'resource') {
      console.warn('SECURITY: Navigation timing fingerprinting blocked');
      return [];
    }
    return originalGetEntriesByType.call(this, type);
  };

  // Block screen fingerprinting
  Object.defineProperty(screen, 'width', { value: 1920, configurable: false });
  Object.defineProperty(screen, 'height', { value: 1080, configurable: false });
  Object.defineProperty(screen, 'colorDepth', { value: 24, configurable: false });
  Object.defineProperty(screen, 'pixelDepth', { value: 24, configurable: false });

  // Block timezone fingerprinting
  const originalToLocaleString = Date.prototype.toLocaleString;
  Date.prototype.toLocaleString = function(...args: any[]) {
    console.warn('SECURITY: Timezone fingerprinting attempt blocked');
    return new Date(this.getTime()).toISOString();
  };

  // Block user agent parsing
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    configurable: false
  });

  // Block plugin enumeration
  Object.defineProperty(navigator, 'plugins', { value: [], configurable: false });

  // Block battery status API
  if ('getBattery' in navigator) {
    (navigator as any).getBattery = function() {
      console.warn('SECURITY: Battery fingerprinting blocked');
      return Promise.reject(new Error('Battery API blocked for privacy'));
    };
  }

  // Block device memory fingerprinting
  Object.defineProperty(navigator, 'deviceMemory', { value: 8, configurable: false });
  Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: false });

  // Block connection fingerprinting
  Object.defineProperty(navigator, 'connection', { 
    value: { effectiveType: '4g', downlink: 10 }, 
    configurable: false 
  });

  // Block UTS tracking system specifically
  const originalConsoleLog = console.log;
  console.log = function(...args: any[]) {
    const message = args.join(' ');
    // Block all UTS tracking messages
    if (message.includes('[UTS]') || message.includes('UTS') || 
        message.includes('_fbp') || message.includes('fingerprint') ||
        message.includes('gusid') || message.includes('HB-ET')) {
      console.warn('SECURITY: UTS tracking attempt blocked:', message);
      return;
    }
    return originalConsoleLog.apply(this, args);
  };

  // Block any external script loading
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Block UTS and tracking URLs
    if (url.includes('UTS') || url.includes('_fbp') || 
        url.includes('fingerprint') || url.includes('gusid') ||
        url.includes('facebook') || url.includes('fbcdn') ||
        url.includes('connect.facebook.net')) {
      console.warn('SECURITY: Tracking request blocked:', url);
      return Promise.reject(new Error('Tracking request blocked for privacy'));
    }
    
    return originalFetch.apply(this, [input, init]);
  };

  // Block localStorage and sessionStorage access for tracking
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key: string, value: string) {
    if (key.includes('_fbp') || key.includes('UTS') || 
        key.includes('fingerprint') || key.includes('gusid')) {
      console.warn('SECURITY: Tracking storage blocked:', key);
      return;
    }
    return originalSetItem.call(this, key, value);
  };

  console.log('🔒 SECURITY: Ultra-aggressive fingerprinting blocker activated');
};

// Initialize fingerprinting protection immediately
blockFingerprinting();