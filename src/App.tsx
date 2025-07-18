
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
  // Enhanced console check after reload
  React.useEffect(() => {
    const checkConsole = () => {
      if ((window as any).consoleCapture) {
        const stats = (window as any).consoleCapture.getMessageStats();
        const allMessages = (window as any).consoleCapture.getAllMessages();
        const errors = (window as any).consoleCapture.getErrorsAndWarnings();
        
        console.log('🔄 POST-RELOAD CONSOLE STATUS:');
        console.log('📊 Total messages captured:', stats.total);
        console.log('🔍 Breakdown:', stats);
        console.log('❌ Errors found:', errors.filter(m => m.level === 'error').length);
        console.log('⚠️  Warnings found:', errors.filter(m => m.level === 'warn').length);
        
        if (errors.length > 0) {
          console.log('🚨 ERRORS & WARNINGS DETECTED:');
          errors.forEach((msg, i) => {
            console.log(`${i + 1}. [${msg.level.toUpperCase()}] ${msg.message}`);
            if (msg.source) {
              console.log(`   Source: ${msg.source.file}:${msg.source.line}`);
            }
          });
        }
        
        // Log recent activity
        const recentMessages = allMessages.slice(-10);
        if (recentMessages.length > 0) {
          console.log('📋 Last 10 messages captured:');
          recentMessages.forEach((msg, i) => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            console.log(`${i + 1}. [${time}] [${msg.level}] ${msg.message.substring(0, 100)}...`);
          });
        }
      } else {
        console.log('⏳ Console capture still initializing...');
        setTimeout(checkConsole, 500);
      }
    };
    
    // Check immediately and then periodically
    setTimeout(checkConsole, 1000);
    const interval = setInterval(checkConsole, 5000);
    
    return () => clearInterval(interval);
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
