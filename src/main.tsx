
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

// Clear any existing service worker caches to prevent stale asset issues
if ('serviceWorker' in navigator) {
  // Send message to clear cache
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
    }
  }).catch(() => {
    // Silent fail - service worker might not be active yet
  });

  // Service worker registration - only in production
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      // Unregister old service worker first
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      }).then(() => {
        // Register new service worker
        return navigator.serviceWorker.register('/optimized-sw.js', {
          updateViaCache: 'none' // Disable service worker caching
        });
      }).then((registration) => {
        console.log('SW registered: ', registration);
        // Force immediate activation
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }).catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}

// Enhanced error handling with cache clearing
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // If it's a loading error, try to clear caches
  if (event.error && event.error.message && event.error.message.includes('Loading')) {
    console.log('Detected loading error, attempting cache clear...');
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root...');

try {
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to render app:', error);
  // Provide more detailed error information with cache clearing option
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
          <p style="margin-bottom: 12px;">The application failed to start due to a loading error.</p>
          <p style="margin-bottom: 20px; font-size: 14px; color: #666;">Error: ${error?.message || 'Unknown error'}</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button onclick="window.location.reload()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Refresh Page
            </button>
            <button onclick="
              if ('caches' in window) {
                caches.keys().then(cacheNames => {
                  return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
                }).then(() => {
                  window.location.reload();
                });
              } else {
                window.location.reload();
              }
            " style="padding: 12px 24px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Clear Cache & Refresh
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
