import React, { useEffect, useState } from 'react';
import { AppThemeProviders } from '../contexts/AppThemeProviders';
import { PublicThemeProviders } from '../contexts/PublicThemeProviders';
import { AppProviders } from './AppProviders';
import { OnboardingProvider } from './Onboarding/OnboardingProvider';

type ConditionalThemeWrapperProps = {
  children: React.ReactNode;
};

/**
 * Component that wraps routes with appropriate theme providers
 * Uses window.location to avoid router context dependency
 */
export function ConditionalThemeWrapper({ children }: ConditionalThemeWrapperProps) {
  // Determine route synchronously to prevent flashing
  const getIsAppRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth');
  };
  
  const [isAppRoute, setIsAppRoute] = useState(getIsAppRoute);
  
  useEffect(() => {
    // Listen for navigation changes only
    const handleNavigation = () => {
      const path = window.location.pathname;
      setIsAppRoute(path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth'));
    };
    
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);
  
  // For app routes, use the full theme provider with user settings AND AppProviders
  if (isAppRoute) {
    return (
      <AppProviders>
        <AppThemeProviders>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </AppThemeProviders>
      </AppProviders>
    );
  }
  
  // For public routes, use the minimal public theme provider
  return (
    <PublicThemeProviders>
      {children}
    </PublicThemeProviders>
  );
}