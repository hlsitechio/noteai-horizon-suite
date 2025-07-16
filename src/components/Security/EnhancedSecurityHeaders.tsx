
import { useEffect } from 'react';
import { SecurityHeadersService } from '@/services/security/securityHeadersService';

const EnhancedSecurityHeaders = () => {
  useEffect(() => {
    // Get enhanced security headers from service
    const securityService = new SecurityHeadersService();
    const allSecurityHeaders = securityService.getAllSecurityHeaders();

    // Convert headers to meta tag format
    const securityHeaders = Object.entries(allSecurityHeaders).map(([name, content]) => ({
      name,
      content
    }));

    // Add additional development-friendly headers
    securityHeaders.push(
      { name: 'Cross-Origin-Opener-Policy', content: import.meta.env.PROD ? 'same-origin' : 'same-origin-allow-popups' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' }
    );

    // Set meta tags for security headers
    securityHeaders.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Set security-related HTML attributes
    document.documentElement.setAttribute('data-security-enhanced', 'true');
    
    // Disable right-click context menu in production only
    const handleContextMenu = (e: Event) => {
      if (import.meta.env.PROD) {
        e.preventDefault();
        return false;
      }
    };

    // Disable common developer shortcuts in production only
    const handleKeyDown = (e: KeyboardEvent) => {
      if (import.meta.env.PROD) {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      // Remove security headers on unmount
      securityHeaders.forEach(({ name }) => {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
          document.head.removeChild(meta);
        }
      });

      // Remove event listeners
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Remove security attribute
      document.documentElement.removeAttribute('data-security-enhanced');
    };
  }, []);

  return null;
};

export default EnhancedSecurityHeaders;
