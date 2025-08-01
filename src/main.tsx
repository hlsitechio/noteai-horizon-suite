
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
import { cspInitializationService } from './services/security/cspInitializationService'
import { accessibilityLabelFixerService } from './services/accessibility/labelFixerService'
import { formAccessibilityService } from './services/accessibility/formAccessibilityService'
import './utils/enhancedPreloadCleaner'

// Initialize security measures immediately
blockUTSTracking();
blockFingerprinting();
blockExternalTracking();
enforcePermissionsPolicy();

// Initialize enhanced CSP with dynamic headers and monitoring
cspInitializationService.initialize();

// Initialize comprehensive form accessibility (includes label fixing)
formAccessibilityService.initialize();

// Initialize unified console management
initializeConsole();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
