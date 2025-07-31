
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import security and optimization utilities
import { blockUTSTracking } from './utils/blockUTSTracking'
import { blockFingerprinting } from './utils/blockFingerprinting'
import { blockExternalTracking } from './utils/blockExternalTracking'
import { enforcePermissionsPolicy } from './utils/permissionsPolicyEnforcer'
import { initializeConsole } from './utils/consoleInitializer'
import './utils/enhancedPreloadCleaner'

// Initialize security measures immediately
blockUTSTracking();
blockFingerprinting();
blockExternalTracking();
enforcePermissionsPolicy();

// Initialize unified console management
initializeConsole();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
