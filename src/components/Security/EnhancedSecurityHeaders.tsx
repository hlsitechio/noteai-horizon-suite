import { useEffect } from 'react';

const EnhancedSecurityHeaders = () => {
  useEffect(() => {
    // Enhanced Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://browser.sentry-cdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: blob:",
      "connect-src 'self' https://qrdulwzjgbfgaplazgsh.supabase.co https://www.google-analytics.com https://api.openai.com https://api.openrouter.ai https://ingest.us.sentry.io wss://qrdulwzjgbfgaplazgsh.supabase.co",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join('; ');

    // Enhanced security headers
    const securityHeaders = [
      { name: 'Content-Security-Policy', content: csp },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
      { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' },
      { name: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' },
    ];

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
    
    // Disable right-click context menu in production
    const handleContextMenu = (e: Event) => {
      if (!import.meta.env.DEV) {
        e.preventDefault();
        return false;
      }
    };

    // Disable common developer shortcuts in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!import.meta.env.DEV) {
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