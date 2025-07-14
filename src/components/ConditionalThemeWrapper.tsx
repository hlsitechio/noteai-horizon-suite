import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppThemeProviders } from '../contexts/AppThemeProviders';
import { PublicThemeProviders } from '../contexts/PublicThemeProviders';

type ConditionalThemeWrapperProps = {
  children: React.ReactNode;
};

/**
 * Component that wraps routes with appropriate theme providers
 * Must be used INSIDE Router context
 */
export function ConditionalThemeWrapper({ children }: ConditionalThemeWrapperProps) {
  const location = useLocation();
  
  // Determine if we're on an app route (authenticated area)
  const isAppRoute = location.pathname.startsWith('/app');
  
  // For app routes, use the full theme provider with user settings
  if (isAppRoute) {
    return (
      <AppThemeProviders>
        {children}
      </AppThemeProviders>
    );
  }
  
  // For public routes, use the minimal public theme provider
  return (
    <PublicThemeProviders>
      {children}
    </PublicThemeProviders>
  );
}