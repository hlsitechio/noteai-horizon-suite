/**
 * Permissions Policy Blocker
 * Blocks deprecated and potentially harmful permissions policy directives
 */

export const blockDeprecatedPermissions = () => {
  if (typeof window === 'undefined') return;

  // Block attempts to set deprecated permissions via any method
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name: string, value: string) {
    if (name.toLowerCase() === 'allow' || name.toLowerCase() === 'permissions-policy') {
      // Check for deprecated features
      if (value.includes('vr=') || value.includes('battery=')) {
        console.warn('🚫 Blocked deprecated permissions policy:', value);
        return; // Don't set the attribute
      }
    }
    return originalSetAttribute.call(this, name, value);
  };

  // Also block via property assignments
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const target = mutation.target as Element;
        const attrName = mutation.attributeName;
        
        if (attrName === 'allow' || attrName === 'permissions-policy') {
          const value = target.getAttribute(attrName);
          if (value && (value.includes('vr=') || value.includes('battery='))) {
            console.warn('🚫 Removed deprecated permissions policy attribute:', value);
            target.removeAttribute(attrName);
          }
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['allow', 'permissions-policy']
  });

  // Clean up existing deprecated permissions
  const cleanupExisting = () => {
    const elements = document.querySelectorAll('[allow*="vr="], [allow*="battery="], [permissions-policy*="vr="], [permissions-policy*="battery="]');
    elements.forEach((element) => {
      ['allow', 'permissions-policy'].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (value && (value.includes('vr=') || value.includes('battery='))) {
          console.warn('🚫 Cleaned up deprecated permissions policy:', value);
          element.removeAttribute(attr);
        }
      });
    });
  };

  // Run cleanup immediately and after DOM is loaded
  cleanupExisting();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupExisting);
  }
};

// Initialize immediately
blockDeprecatedPermissions();