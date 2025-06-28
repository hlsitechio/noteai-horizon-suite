
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

// Register optimized service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/optimized-sw.js')
      .then((registration) => {
        console.log('Optimized SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent lovable.js errors from crashing the app
  if (event.error?.message?.includes('lovable')) {
    event.preventDefault();
    console.log('Prevented lovable.js error from crashing app');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent promise rejection crashes
  if (event.reason?.message?.includes('lovable')) {
    event.preventDefault();
    console.log('Prevented lovable.js promise rejection from crashing app');
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
} else {
  console.log('Root element found, creating React root...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to render app:', error);
    // Show a basic error message to the user
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center; max-width: 500px; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
          <p style="margin-bottom: 20px;">The application failed to start. This might be due to a temporary issue.</p>
          <button onclick="window.location.reload()" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Refresh Page
          </button>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            If the problem persists, try clearing your browser cache or contact support.
          </p>
        </div>
      </div>
    `;
  }
}
