
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
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import { AppProviders } from './components/AppProviders';
import { OptimizedLazyRoutes } from './components/OptimizedLazyRoutes';

import './App.css';

const SentryRouter = Sentry.withSentryRouting(Router);

function App() {
  const { trackOperation } = usePerformanceMonitoring();

  return (
    <AppProviders>
      <SentryRouter>
        <OptimizedLazyRoutes />
        <Toaster />
        <Sonner />
      </SentryRouter>
    </AppProviders>
  );
}

export default Sentry.withProfiler(App);
