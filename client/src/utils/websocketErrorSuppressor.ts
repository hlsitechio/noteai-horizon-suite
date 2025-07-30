
/**
 * WebSocket Error Suppressor
 * Handles websocket connection errors gracefully without console spam
 */

export const suppressWebSocketErrors = () => {
  if (typeof window === 'undefined') return;

  // Override WebSocket to handle connection errors gracefully
  const originalWebSocket = window.WebSocket;
  
  window.WebSocket = class extends originalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super(url, protocols);
      
      // Add error handler to prevent uncaught errors
      this.addEventListener('error', (event) => {
        // Silently handle websocket errors - they're often from extensions or tracking
        event.preventDefault();
        event.stopPropagation();
      });

      this.addEventListener('close', (event) => {
        // Handle close events silently for tracking-related websockets
        if (this.url.includes('tracking') || 
            this.url.includes('analytics') || 
            this.url.includes('facebook') ||
            this.url.includes('google')) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
  };

  // Handle message port errors (usually from browser extensions)
  window.addEventListener('error', (event) => {
    if (event.message && 
        (event.message.includes('message port closed') ||
         event.message.includes('port closed before a response'))) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections from websockets
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && typeof reason === 'object' && 
        (reason.message?.includes('WebSocket') ||
         reason.message?.includes('message port') ||
         reason.code === 'NETWORK_ERROR')) {
      event.preventDefault();
    }
  });
};

// Initialize immediately
suppressWebSocketErrors();
