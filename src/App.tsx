
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
import '@/utils/consoleCapture'; // Initialize console capture

// Sentry disabled - use plain Router
const AppRouter = Router;

function App() {
  // Temporary console check for user
  React.useEffect(() => {
    const checkConsole = () => {
      if ((window as any).consoleCapture) {
        const stats = (window as any).consoleCapture.getMessageStats();
        console.log('🔍 CURRENT CONSOLE MESSAGE COUNT:', stats.total);
        console.log('📊 Breakdown:', stats);
        console.log('📋 Total captured messages:', stats.total);
      } else {
        console.log('⏳ Console capture not ready yet, checking again...');
        setTimeout(checkConsole, 1000);
      }
    };
    setTimeout(checkConsole, 2000); // Give time for capture to initialize
  }, []);
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
