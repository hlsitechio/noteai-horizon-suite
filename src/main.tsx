
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize error handling systems first (before React)
import { initSentry } from '@/config/sentry';
import { errorPreventionSystem } from '@/utils/errorPreventionSystem';
import { errorCorrectionSystem } from '@/utils/errorCorrectionSystem';

// Initialize Sentry first
console.log('🚀 Starting Online Note AI...');
try {
  initSentry();
  console.log('✅ Sentry initialized');
} catch (error) {
  console.warn('⚠️ Sentry initialization failed:', error);
}

// Initialize error systems
try {
  errorPreventionSystem.initialize();
  errorCorrectionSystem.initialize();
  console.log('✅ Error systems initialized');
} catch (error) {
  console.warn('⚠️ Error systems initialization failed:', error);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(<App />);
