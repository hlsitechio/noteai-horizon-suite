import React from 'react';
import { createRoot } from 'react-dom/client';
import { blockExternalTracking } from './utils/blockExternalTracking';
import { blockUTSTracking } from './utils/blockUTSTracking';
import { enforcePermissionsPolicy } from './utils/permissionsPolicyEnforcer';
import './utils/blockFingerprinting'; // ULTRA-AGGRESSIVE: Block all fingerprinting attempts
import { devExperienceOptimizer } from './utils/devExperienceOptimizer'; // CLEAN: Optimized dev experience
import './utils/debugPermissionsPolicy'; // DEBUG: Track permissions policy issues
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AppInitializationService } from './services/appInitializationService';
import { TestingService } from './services/testingService';
import { BundleAnalysisService } from './services/bundleAnalysisService';
import { OnboardingService } from './services/onboardingService';

// Block external tracking injection before app initialization
blockExternalTracking();
blockUTSTracking();
enforcePermissionsPolicy();

// Initialize optimized development experience
devExperienceOptimizer.optimize();

// Initialize app with optimized services
AppInitializationService.initialize();

// Initialize completion services
BundleAnalysisService.initialize();
OnboardingService.initialize();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const container = document.getElementById('root')!;
const root = createRoot(container);
// Remove StrictMode in production to prevent development-only double renders
const AppWrapper = import.meta.env.DEV ? (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
) : (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </QueryClientProvider>
);

root.render(AppWrapper);
