import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import { ConditionalThemeWrapper } from './components/ConditionalThemeWrapper';
import { OptimizedLazyRoutes } from './components/OptimizedLazyRoutes';
import { SmartErrorBoundary } from './components/ErrorBoundary/SmartErrorBoundary';
import { ReloadPreventionProvider } from './components/ReloadPrevention/ReloadPreventionProvider';
import { AppProviders } from './components/AppProviders';

import './App.css';
// Console management handled by unified system in main.tsx


const AppRouter = Router;

function App() {
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}

export default App;