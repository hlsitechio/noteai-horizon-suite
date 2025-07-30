/**
 * Debug Permissions Policy Issues
 * Helps identify where deprecated permissions policy features are coming from
 */

export const debugPermissionsPolicy = () => {
  if (typeof window === 'undefined') return;

  console.log('🔍 DEBUG: Permissions Policy Analysis');
  
  // Check meta tags in HTML
  const metaTags = document.querySelectorAll('meta[http-equiv="Permissions-Policy"]');
  metaTags.forEach((meta, index) => {
    const content = meta.getAttribute('content');
    console.log(`Meta tag ${index + 1} content:`, content);
    
    if (content?.includes('vr=')) {
      console.warn('❌ Found deprecated "vr" feature in meta tag');
    }
    if (content?.includes('battery=')) {
      console.warn('❌ Found deprecated "battery" feature in meta tag');
    }
  });

  // Check document.featurePolicy if available
  if ('featurePolicy' in document) {
    const featurePolicy = (document as any).featurePolicy;
    if (featurePolicy && featurePolicy.getAllowlistForFeature) {
      try {
        const vrAllowlist = featurePolicy.getAllowlistForFeature('vr');
        if (vrAllowlist !== null) {
          console.warn('❌ VR feature policy is active:', vrAllowlist);
        }
      } catch (e) {
        console.log('✅ VR feature not recognized (good)');
      }
      
      try {
        const batteryAllowlist = featurePolicy.getAllowlistForFeature('battery');
        if (batteryAllowlist !== null) {
          console.warn('❌ Battery feature policy is active:', batteryAllowlist);
        }
      } catch (e) {
        console.log('✅ Battery feature not recognized (good)');
      }
    }
  }
  
  // Check response headers (if we can access them)
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    console.log('📊 Navigation entries found:', navigationEntries.length);
  }
  
  console.log('🔍 Permissions Policy debug complete');
};

// Run debug check after DOM loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugPermissionsPolicy);
  } else {
    debugPermissionsPolicy();
  }
}