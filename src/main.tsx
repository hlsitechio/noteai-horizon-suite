
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
import { formAccessibilityService } from './services/accessibility/formAccessibilityService'
import { FormAccessibilityDiagnostic } from './services/accessibility/formDiagnosticService'
import { AggressiveFormFieldFixer } from './services/accessibility/aggressiveFormFixer'
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

// Start continuous form monitoring and diagnostic
setTimeout(() => {
  FormAccessibilityDiagnostic.startContinuousMonitoring();
  
  // Emergency fix if there are still issues
  setTimeout(() => {
    const diagnostic = FormAccessibilityDiagnostic.runDiagnostic();
    if (diagnostic.fieldsWithoutBoth.length > 0) {
      console.warn(`🚨 Found ${diagnostic.fieldsWithoutBoth.length} fields still missing ID/name. Running emergency fix...`);
      FormAccessibilityDiagnostic.fixAllIssuesNow();
      
      // If still issues, run aggressive fixer
      setTimeout(() => {
        const finalDiagnostic = FormAccessibilityDiagnostic.runDiagnostic();
        if (finalDiagnostic.fieldsWithoutBoth.length > 0) {
          console.warn(`🚨 Still ${finalDiagnostic.fieldsWithoutBoth.length} problematic fields. Running aggressive fixer...`);
          AggressiveFormFieldFixer.runAggressiveFix();
        }
      }, 1000);
    }
  }, 2000);
}, 500);

// Initialize unified console management
initializeConsole();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
