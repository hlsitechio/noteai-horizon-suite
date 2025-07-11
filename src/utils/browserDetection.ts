/**
 * Browser Detection Service
 * Provides comprehensive browser and device detection for PWA compatibility
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsServiceWorker: boolean;
  supportsPWA: boolean;
  supportsInstallPrompt: boolean;
  installInstructions: string[];
}

export interface PWACapabilities {
  canInstall: boolean;
  canUseOffline: boolean;
  canReceiveNotifications: boolean;
  canAccessCamera: boolean;
  canAccessLocation: boolean;
  reason?: string;
}

/**
 * Detects the current browser and returns detailed information
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  // Browser detection
  let browserName = 'Unknown';
  let browserVersion = '0';
  let engine = 'Unknown';
  
  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : '0';
    engine = 'Blink';
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/([0-9.]+)/);
    browserVersion = match ? match[1] : '0';
    engine = 'Blink';
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : '0';
    engine = 'Gecko';
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browserVersion = match ? match[1] : '0';
    engine = 'WebKit';
  }
  // Opera
  else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    browserName = 'Opera';
    const match = userAgent.match(/(OPR|Opera)\/([0-9.]+)/);
    browserVersion = match ? match[2] : '0';
    engine = 'Blink';
  }

  // Device type detection
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  // PWA support detection
  const supportsServiceWorker = 'serviceWorker' in navigator;
  const supportsInstallPrompt = 'BeforeInstallPromptEvent' in window || 
                                 (browserName === 'Safari' && isMobile);
  
  // PWA support varies by browser
  let supportsPWA = false;
  let installInstructions: string[] = [];

  if (browserName === 'Chrome' || browserName === 'Edge') {
    supportsPWA = true;
    installInstructions = [
      'Look for the install icon in the address bar',
      'Or go to browser menu → Install app',
      'Click "Install" when prompted'
    ];
  } else if (browserName === 'Firefox') {
    supportsPWA = true;
    installInstructions = [
      'Click the three-line menu button',
      'Select "Install" or "Add to Home Screen"',
      'Follow the installation prompts'
    ];
  } else if (browserName === 'Safari') {
    supportsPWA = isMobile;
    if (isMobile) {
      installInstructions = [
        'Tap the Share button',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to confirm'
      ];
    } else {
      installInstructions = [
        'Safari on desktop has limited PWA support',
        'Consider using Chrome or Edge for full PWA features'
      ];
    }
  } else {
    installInstructions = [
      'Your browser may have limited PWA support',
      'Try using Chrome, Edge, or Firefox for the best experience'
    ];
  }

  return {
    name: browserName,
    version: browserVersion,
    engine,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    supportsServiceWorker,
    supportsPWA,
    supportsInstallPrompt,
    installInstructions
  };
}

/**
 * Checks PWA capabilities for the current browser
 */
export function checkPWACapabilities(): PWACapabilities {
  const browser = detectBrowser();
  
  const capabilities: PWACapabilities = {
    canInstall: false,
    canUseOffline: false,
    canReceiveNotifications: false,
    canAccessCamera: false,
    canAccessLocation: false
  };

  // Check installation capability
  if (browser.supportsPWA && browser.supportsServiceWorker) {
    capabilities.canInstall = true;
  } else {
    capabilities.reason = `${browser.name} ${
      browser.supportsServiceWorker 
        ? 'may have limited PWA support' 
        : 'does not support Service Workers'
    }`;
  }

  // Check offline capability
  capabilities.canUseOffline = browser.supportsServiceWorker;

  // Check notification support
  capabilities.canReceiveNotifications = 'Notification' in window && 
                                         Notification.permission !== 'denied';

  // Check camera access
  capabilities.canAccessCamera = 'mediaDevices' in navigator && 
                                 'getUserMedia' in navigator.mediaDevices;

  // Check location access
  capabilities.canAccessLocation = 'geolocation' in navigator;

  return capabilities;
}

/**
 * Gets a user-friendly browser compatibility message
 */
export function getBrowserCompatibilityMessage(): {
  isCompatible: boolean;
  message: string;
  suggestion?: string;
} {
  const browser = detectBrowser();
  const capabilities = checkPWACapabilities();

  if (capabilities.canInstall) {
    return {
      isCompatible: true,
      message: `${browser.name} ${browser.version} fully supports PWA installation`
    };
  }

  if (browser.name === 'Safari' && browser.isDesktop) {
    return {
      isCompatible: false,
      message: 'Safari on desktop has limited PWA support',
      suggestion: 'Use Chrome, Edge, or Firefox for the best PWA experience'
    };
  }

  if (!browser.supportsServiceWorker) {
    return {
      isCompatible: false,
      message: `${browser.name} ${browser.version} does not support Service Workers`,
      suggestion: 'Please update your browser or use Chrome, Edge, or Firefox'
    };
  }

  return {
    isCompatible: false,
    message: `${browser.name} ${browser.version} has limited PWA support`,
    suggestion: 'Try Chrome, Edge, or Firefox for full PWA functionality'
  };
}

/**
 * Checks if the app is currently running as a PWA
 */
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://') ||
         window.location.search.includes('utm_source=pwa');
}

/**
 * Gets platform-specific installation instructions
 */
export function getInstallationGuide(): {
  platform: string;
  instructions: string[];
  videoUrl?: string;
} {
  const browser = detectBrowser();
  
  if (browser.isMobile) {
    if (browser.name === 'Safari') {
      return {
        platform: 'iOS Safari',
        instructions: [
          'Open the website in Safari',
          'Tap the Share button (square with arrow)',
          'Scroll down and tap "Add to Home Screen"',
          'Edit the name if desired and tap "Add"'
        ]
      };
    } else {
      return {
        platform: 'Android Chrome',
        instructions: [
          'Open the website in Chrome',
          'Tap the three-dot menu',
          'Select "Add to Home screen"',
          'Tap "Add" to confirm'
        ]
      };
    }
  }

  // Desktop instructions
  if (browser.name === 'Chrome') {
    return {
      platform: 'Chrome Desktop',
      instructions: [
        'Look for the install icon in the address bar (computer icon)',
        'Click the install icon',
        'Click "Install" in the dialog',
        'The app will open in its own window'
      ]
    };
  } else if (browser.name === 'Edge') {
    return {
      platform: 'Edge Desktop',
      instructions: [
        'Click the three-dot menu',
        'Select "Apps" → "Install this site as an app"',
        'Click "Install" to confirm',
        'The app will open in its own window'
      ]
    };
  } else if (browser.name === 'Firefox') {
    return {
      platform: 'Firefox Desktop',
      instructions: [
        'Click the three-line menu',
        'Look for "Install" option',
        'Follow the installation prompts',
        'Some versions may require enabling PWA support in about:config'
      ]
    };
  }

  return {
    platform: 'General',
    instructions: [
      'PWA installation varies by browser',
      'Look for install prompts or menu options',
      'Check your browser\'s app or extensions menu',
      'Consider switching to Chrome or Edge for better PWA support'
    ]
  };
}