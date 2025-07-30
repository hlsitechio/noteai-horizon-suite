/**
 * Simple browser detection utility (PWA functionality removed)
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isMobile: boolean;
  isDesktop: boolean;
  platform: string;
}

/**
 * Detects basic browser information without PWA capabilities
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Browser detection
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
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    name = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  
  return {
    name,
    version,
    isMobile,
    isDesktop: !isMobile,
    platform: platform || 'Unknown'
  };
}