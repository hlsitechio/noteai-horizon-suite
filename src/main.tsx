
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize error handling systems
import { initSentry } from '@/config/sentry';
import { errorPreventionSystem } from '@/utils/errorPreventionSystem';
import { errorCorrectionSystem } from '@/utils/errorCorrectionSystem';

// Initialize Sentry first
initSentry();

// Initialize error systems
errorPreventionSystem.initialize();
errorCorrectionSystem.initialize();

// Add some logging to understand what's happening
console.log('🚀 Starting Online Note AI...');
console.log('🛡️ Error systems initialized');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
