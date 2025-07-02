
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://qrdulwzjgbfgaplazgsh.supabase.co https://www.google-analytics.com https://api.openai.com https://api.openrouter.ai https://ingest.us.sentry.io",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    // Set meta tags for security (Note: X-Frame-Options should be set via HTTP headers in production)
    const metaTags = [
      { name: 'Content-Security-Policy', content: csp },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    return () => {
      // Cleanup on unmount
      metaTags.forEach(({ name }) => {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
          document.head.removeChild(meta);
        }
      });
    };
  }, []);

  return null;
};

export default SecurityHeaders;
