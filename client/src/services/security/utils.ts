/**
 * Security Headers Utility Functions
 */

export function isSameOrigin(url: string): boolean {
  if (typeof window === 'undefined') return true;
  
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function matchesWildcard(url: string, pattern: string): boolean {
  // Simple wildcard matching for CSP sources
  if (pattern.includes('*')) {
    const regexPattern = pattern.replace(/\*/g, '.*');
    return new RegExp(`^${regexPattern}$`).test(url);
  }
  return url.startsWith(pattern);
}

export function getCSPDirectiveForResource(resourceType: string): string {
  const mapping: Record<string, string> = {
    script: 'script-src',
    style: 'style-src',
    image: 'img-src',
    font: 'font-src',
    connect: 'connect-src',
    frame: 'frame-src',
    worker: 'worker-src',
    object: 'object-src'
  };

  return mapping[resourceType] || 'default-src';
}