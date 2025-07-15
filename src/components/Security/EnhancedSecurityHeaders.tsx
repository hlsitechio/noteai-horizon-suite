
import { useEffect } from 'react';

const EnhancedSecurityHeaders = () => {
  useEffect(() => {
    // Enhanced Content Security Policy - allow Lovable scripts
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.gpteng.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' data: blob:",
      "connect-src 'self' https://ubxtmbgvibtjtjggjnjm.supabase.co https://www.google-analytics.com https://api.openai.com https://api.openrouter.ai wss://ubxtmbgvibtjtjggjnjm.supabase.co ws://localhost:* wss://localhost:* ws://0.0.0.0:* ws://127.0.0.1:* *.lovable.app *.lovableproject.com *.cloudflareinsights.com https://lovable-api.com",
      "referrer no-referrer-when-downgrade",
      "frame-src 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join('; ');

    // Development-friendly security headers with relaxed Cross-Origin-Opener-Policy
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      // Only apply strict headers in production, with relaxed COOP policy
      ...(import.meta.env.PROD ? [
        { name: 'Content-Security-Policy', content: csp },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(self), payment=(), fullscreen=(self)' },
        { name: 'X-Frame-Options', content: 'SAMEORIGIN' },
        { name: 'Cross-Origin-Opener-Policy', content: 'same-origin-allow-popups' }, // More permissive
        { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      ] : [])
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
