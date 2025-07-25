
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import { ConditionalThemeWrapper } from './components/ConditionalThemeWrapper';
import { OptimizedLazyRoutes } from './components/OptimizedLazyRoutes';
import { SmartErrorBoundary } from './components/ErrorBoundary/SmartErrorBoundary';
import { ReloadPreventionProvider } from './components/ReloadPrevention/ReloadPreventionProvider';
import { AppProviders } from './components/AppProviders';

import './App.css';
import '@/utils/simpleConsoleInspector'; // Simple error/warning tracking

// Sentry disabled - use plain Router
const AppRouter = Router;

function App() {
  return (
    <SmartErrorBoundary preserveWork={true}>
      <ReloadPreventionProvider>
        <AppRouter>
          <AppProviders>
            <ConditionalThemeWrapper>
              <OptimizedLazyRoutes />
              <Toaster />
              <Sonner />
            </ConditionalThemeWrapper>
          </AppProviders>
        </AppRouter>
      </ReloadPreventionProvider>
    </SmartErrorBoundary>
  );
}

export default App;
