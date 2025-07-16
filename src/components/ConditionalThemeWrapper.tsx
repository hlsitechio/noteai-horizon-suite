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
    console.log('ConditionalThemeWrapper: Current path:', path);
    const isApp = path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth');
    console.log('ConditionalThemeWrapper: Is app route:', isApp);
    return isApp;
  };
  
  const [isAppRoute, setIsAppRoute] = useState(getIsAppRoute);
  
  useEffect(() => {
    // Listen for navigation changes only
    const handleNavigation = () => {
      const path = window.location.pathname;
      console.log('ConditionalThemeWrapper: Navigation to:', path);
      const isApp = path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth');
      console.log('ConditionalThemeWrapper: Setting isAppRoute to:', isApp);
      setIsAppRoute(isApp);
    };
    
    // Also listen for pushstate and replacestate events for React Router navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleNavigation, 0);
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleNavigation, 0);
    };
    
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
  
  // For app routes, use the full theme provider with user settings AND AppProviders
  if (isAppRoute) {
    console.log('ConditionalThemeWrapper: Rendering with AppProviders (includes AuthProvider)');
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
  console.log('ConditionalThemeWrapper: Rendering with PublicThemeProviders (no AuthProvider)');
  return (
    <PublicThemeProviders>
      {children}
    </PublicThemeProviders>
  );
}