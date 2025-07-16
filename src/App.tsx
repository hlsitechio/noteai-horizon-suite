
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import { OnboardingProvider } from './components/Onboarding/OnboardingProvider';
import { ConditionalThemeWrapper } from './components/ConditionalThemeWrapper';
import { OptimizedLazyRoutes } from './components/OptimizedLazyRoutes';
import { SmartErrorBoundary } from './components/ErrorBoundary/SmartErrorBoundary';
import { ReloadPreventionProvider } from './components/ReloadPrevention/ReloadPreventionProvider';

import './App.css';

// Sentry disabled - use plain Router
const AppRouter = Router;

function App() {
  return (
    <SmartErrorBoundary preserveWork={true}>
      <ReloadPreventionProvider>
        <AppRouter>
          <ConditionalThemeWrapper>
            <OnboardingProvider>
              <OptimizedLazyRoutes />
              <Toaster />
              <Sonner />
            </OnboardingProvider>
          </ConditionalThemeWrapper>
        </AppRouter>
      </ReloadPreventionProvider>
    </SmartErrorBoundary>
  );
}

export default App;
