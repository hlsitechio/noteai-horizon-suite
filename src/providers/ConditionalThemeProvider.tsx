import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { PublicThemeProvider } from './PublicThemeProvider';

type ConditionalThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * Conditionally applies different theme providers based on route
 * - Public routes: Use PublicThemeProvider (system theme only)
 * - App routes: Use full ThemeProvider with user preferences
 */
export function ConditionalThemeProvider({ children }: ConditionalThemeProviderProps) {
  const location = useLocation();
  
  // Determine if we're on an app route (authenticated area)
  const isAppRoute = location.pathname.startsWith('/app');
  
  // For app routes, use the full theme provider with user settings
  if (isAppRoute) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme">
        {children}
      </ThemeProvider>
    );
  }
  
  // For public routes, use the minimal public theme provider
  return (
    <PublicThemeProvider>
      {children}
    </PublicThemeProvider>
  );
}