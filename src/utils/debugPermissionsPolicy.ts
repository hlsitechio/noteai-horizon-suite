/**
 * Debug Permissions Policy Issues
 * Helps identify where deprecated permissions policy features are coming from
 */

export const debugPermissionsPolicy = () => {
  if (typeof window === 'undefined') return;

  // Use original console to bypass security filters
  const originalConsole = (window as any).__originalConsole || console;
  originalConsole.log('🔍 DEBUG: Permissions Policy Analysis');
  
  // Check meta tags in HTML
  const metaTags = document.querySelectorAll('meta[http-equiv="Permissions-Policy"]');
  originalConsole.log(`Found ${metaTags.length} Permissions-Policy meta tags`);
  
  metaTags.forEach((meta, index) => {
    const content = meta.getAttribute('content');
    originalConsole.log(`Meta tag ${index + 1} content:`, content);
    
    if (content?.includes('vr=')) {
      originalConsole.warn('❌ Found deprecated "vr" feature in meta tag');
    }
    if (content?.includes('battery=')) {
      originalConsole.warn('❌ Found deprecated "battery" feature in meta tag');
    }
  });
  
  // Check for external scripts that might be injecting policies
  const scripts = document.querySelectorAll('script[src]');
  originalConsole.log(`Found ${scripts.length} external scripts`);
  
  scripts.forEach((script, index) => {
    const src = script.getAttribute('src');
    if (src && (src.includes('facebook') || src.includes('fbevents') || src.includes('UTS') || src.includes('connect'))) {
      originalConsole.warn(`❌ Found tracking script ${index + 1}:`, src);
    }
  });

  // Check document.featurePolicy if available
  if ('featurePolicy' in document) {
    const featurePolicy = (document as any).featurePolicy;
    if (featurePolicy && featurePolicy.getAllowlistForFeature) {
      try {
        const vrAllowlist = featurePolicy.getAllowlistForFeature('vr');
        if (vrAllowlist !== null) {
          originalConsole.warn('❌ VR feature policy is active:', vrAllowlist);
        }
      } catch (e) {
        originalConsole.log('✅ VR feature not recognized (good)');
      }
      
      try {
        const batteryAllowlist = featurePolicy.getAllowlistForFeature('battery');
        if (batteryAllowlist !== null) {
          originalConsole.warn('❌ Battery feature policy is active:', batteryAllowlist);
        }
      } catch (e) {
        originalConsole.log('✅ Battery feature not recognized (good)');
      }
    }
  }
  
  // Check response headers (if we can access them)
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    originalConsole.log('📊 Navigation entries found:', navigationEntries.length);
  }
  
  // Check for injected iframes that might have permissions policies
  const iframes = document.querySelectorAll('iframe');
  originalConsole.log(`Found ${iframes.length} iframes`);
  
  iframes.forEach((iframe, index) => {
    const src = iframe.getAttribute('src');
    const allow = iframe.getAttribute('allow');
    if (src || allow) {
      originalConsole.log(`Iframe ${index + 1}:`, { src, allow });
    }
  });
  
  originalConsole.log('🔍 Permissions Policy debug complete');
};

// Run debug check after DOM loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugPermissionsPolicy);
  } else {
    debugPermissionsPolicy();
  }
}