/**
 * Console Initialization
 * Replaces all existing console management systems with the unified approach
 */

import { unifiedConsoleManager } from './unifiedConsoleManager';

// Initialize the unified console management system
export const initializeConsole = () => {
  // Disable all other console management systems
  const disableOtherSystems = () => {
    // Disable ultra secure logging
    if ((window as any).ultraSecureConsole) {
      (window as any).ultraSecureConsole.restore();
    }
    
    // Disable dev experience optimizer
    if ((window as any).devExperienceOptimizer) {
      (window as any).devExperienceOptimizer.restore();
    }
    
    // Disable intelligent console manager
    if ((window as any).intelligentConsoleManager) {
      (window as any).intelligentConsoleManager.setEnabled(false);
    }
  };

  // Clean up any existing overrides
  disableOtherSystems();
  
  // Initialize our unified system
  unifiedConsoleManager.initialize();
  
  // Set up WebSocket error suppression without console override conflicts
  setupWebSocketErrorSuppression();
};

// Simplified WebSocket error suppression that doesn't conflict with console management
const setupWebSocketErrorSuppression = () => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections from websockets silently
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && typeof reason === 'object' && 
        (reason.message?.includes('WebSocket') ||
         reason.message?.includes('message port') ||
         reason.code === 'NETWORK_ERROR')) {
      event.preventDefault();
    }
  });

  // Handle message port errors silently
  window.addEventListener('error', (event) => {
    if (event.message && 
        (event.message.includes('message port closed') ||
         event.message.includes('port closed before a response'))) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
};