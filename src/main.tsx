
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import security and optimization utilities
import { blockUTSTracking } from './utils/blockUTSTracking'
import { blockFingerprinting } from './utils/blockFingerprinting'
import { blockExternalTracking } from './utils/blockExternalTracking'
import { enforcePermissionsPolicy } from './utils/permissionsPolicyEnforcer'
import { devExperienceOptimizer } from './utils/devExperienceOptimizer'
import { intelligentConsoleManager } from './services/intelligentConsoleManager'
import './utils/enhancedPreloadCleaner'
import './utils/websocketErrorSuppressor'

// Initialize security measures immediately
blockUTSTracking();
blockFingerprinting();
blockExternalTracking();
enforcePermissionsPolicy();

// Initialize development experience optimizations
if (import.meta.env.DEV) {
  devExperienceOptimizer.optimize();
}

// Initialize intelligent console management
intelligentConsoleManager.setEnabled(true);
intelligentConsoleManager.setFilterLevel('dev');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
