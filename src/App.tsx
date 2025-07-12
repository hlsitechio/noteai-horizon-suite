
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { OptimizedNotesProvider } from './contexts/OptimizedNotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { DynamicAccentProvider } from './contexts/DynamicAccentContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from './contexts/FloatingNotesContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';

import { AppProviders } from './components/AppProviders';
import { OnboardingProvider } from './components/Onboarding/OnboardingProvider';
import { OptimizedLazyRoutes } from './components/OptimizedLazyRoutes';
import { ReminderManager } from './components/ReminderManager';
import { SmartErrorBoundary } from './components/ErrorBoundary/SmartErrorBoundary';
import { ReloadPreventionProvider } from './components/ReloadPrevention/ReloadPreventionProvider';

import './App.css';

const SentryRouter = Sentry.withSentryRouting(Router);

function App() {

  return (
    <SmartErrorBoundary preserveWork={true}>
      <ReloadPreventionProvider>
        <AppProviders>
          <SentryRouter>
            <OnboardingProvider>
              <OptimizedLazyRoutes />
              <ReminderManager />
              <Toaster />
              <Sonner />
            </OnboardingProvider>
          </SentryRouter>
        </AppProviders>
      </ReloadPreventionProvider>
    </SmartErrorBoundary>
  );
}

export default Sentry.withProfiler(App);
