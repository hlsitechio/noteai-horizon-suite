
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy with proper CORS considerations
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://qrdulwzjgbfgaplazgsh.supabase.co https://www.google-analytics.com https://api.openai.com https://api.openrouter.ai https://ingest.us.sentry.io wss://qrdulwzjgbfgaplazgsh.supabase.co",
      "worker-src 'self' blob:",
      "frame-src 'self' https://lovable.dev",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self' https://lovable.dev",
      "upgrade-insecure-requests"
    ].join('; ');

    // Set meta tags for security (avoiding conflicts with server headers)
    const metaTags = [
      { name: 'Content-Security-Policy', content: csp },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
    ];

    // Only set meta tags if they don't already exist to avoid conflicts
    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Set CORS-friendly headers for client-side requests
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      // Add CORS headers for external API calls
      if (url.includes('api.openai.com') || url.includes('api.openrouter.ai') || url.includes('supabase.co')) {
        init = init || {};
        init.headers = {
          ...init.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        
        // Ensure credentials are included for Supabase requests
        if (url.includes('supabase.co')) {
          init.credentials = 'include';
        }
      }
      
      return originalFetch.call(this, input, init);
    };

    return () => {
      // Cleanup on unmount
      metaTags.forEach(({ name }) => {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta && meta.getAttribute('name') === name) {
          document.head.removeChild(meta);
        }
      });
      
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, []);

  return null;
};

export default SecurityHeaders;
