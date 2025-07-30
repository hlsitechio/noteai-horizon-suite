/**
 * Permissions Policy Enforcer
 * Actively prevents external scripts from setting deprecated permissions policies
 */

export const enforcePermissionsPolicy = () => {
  if (typeof window === 'undefined') return;

  // Block attempts to set deprecated permissions via direct DOM manipulation
  const originalSetAttribute = Element.prototype.setAttribute;
  
  Element.prototype.setAttribute = function(name: string, value: string) {
    // Block deprecated permissions policy features
    if (name === 'http-equiv' && this instanceof HTMLMetaElement) {
      const nextValue = arguments[1];
      if (nextValue === 'Permissions-Policy') {
        // Wait for content to be set and then sanitize it
        setTimeout(() => {
          const content = this.getAttribute('content');
          if (content && (content.includes('vr=') || content.includes('battery='))) {
            const sanitized = content
              .replace(/vr=\([^)]*\),?\s*/g, '')
              .replace(/battery=\([^)]*\),?\s*/g, '')
              .replace(/,\s*,/g, ',') // Clean up double commas
              .replace(/,\s*$/, ''); // Clean up trailing comma
            
            console.warn('SECURITY: Sanitized deprecated permissions policy features');
            originalSetAttribute.call(this, 'content', sanitized);
            return;
          }
        }, 0);
      }
    }
    
    // Also block if content is being set with deprecated features
    if (name === 'content' && this instanceof HTMLMetaElement) {
      const httpEquiv = this.getAttribute('http-equiv');
      if (httpEquiv === 'Permissions-Policy' && (value.includes('vr=') || value.includes('battery='))) {
        const sanitized = value
          .replace(/vr=\([^)]*\),?\s*/g, '')
          .replace(/battery=\([^)]*\),?\s*/g, '')
          .replace(/,\s*,/g, ',')
          .replace(/,\s*$/, '');
        
        console.warn('SECURITY: Sanitized deprecated permissions policy content');
        return originalSetAttribute.call(this, name, sanitized);
      }
    }
    
    return originalSetAttribute.call(this, name, value);
  };

  // Override document.write to prevent injection of deprecated policies
  const originalDocumentWrite = document.write;
  document.write = function(markup: string) {
    if (markup.includes('vr=') || markup.includes('battery=')) {
      const sanitized = markup
        .replace(/vr=\([^)]*\),?\s*/g, '')
        .replace(/battery=\([^)]*\),?\s*/g, '');
      console.warn('SECURITY: Sanitized deprecated permissions in document.write');
      return originalDocumentWrite.call(this, sanitized);
    }
    return originalDocumentWrite.call(this, markup);
  };

  // Block iframe permission attributes with deprecated features
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
    const element = originalCreateElement.call(this, tagName, options);
    
    if (tagName.toLowerCase() === 'iframe') {
      const iframe = element as HTMLIFrameElement;
      const originalSetAttribute = iframe.setAttribute;
      
      iframe.setAttribute = function(name: string, value: string) {
        if (name === 'allow' && (value.includes('vr') || value.includes('battery'))) {
          const sanitized = value
            .replace(/vr[^;]*;?\s*/g, '')
            .replace(/battery[^;]*;?\s*/g, '')
            .replace(/;\s*;/g, ';')
            .replace(/;\s*$/, '');
          console.warn('SECURITY: Sanitized deprecated iframe permissions');
          return originalSetAttribute.call(this, name, sanitized);
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };

  // Clean up any existing deprecated policies
  setTimeout(() => {
    const metaTags = document.querySelectorAll('meta[http-equiv="Permissions-Policy"]');
    metaTags.forEach(meta => {
      const content = meta.getAttribute('content');
      if (content && (content.includes('vr=') || content.includes('battery='))) {
        const sanitized = content
          .replace(/vr=\([^)]*\),?\s*/g, '')
          .replace(/battery=\([^)]*\),?\s*/g, '')
          .replace(/,\s*,/g, ',')
          .replace(/,\s*$/, '');
        
        meta.setAttribute('content', sanitized);
        console.warn('SECURITY: Cleaned up existing deprecated permissions policy');
      }
    });

    const iframes = document.querySelectorAll('iframe[allow]');
    iframes.forEach(iframe => {
      const allow = iframe.getAttribute('allow');
      if (allow && (allow.includes('vr') || allow.includes('battery'))) {
        const sanitized = allow
          .replace(/vr[^;]*;?\s*/g, '')
          .replace(/battery[^;]*;?\s*/g, '')
          .replace(/;\s*;/g, ';')
          .replace(/;\s*$/, '');
        
        iframe.setAttribute('allow', sanitized);
        console.warn('SECURITY: Cleaned up deprecated iframe permissions');
      }
    });
  }, 100);
};