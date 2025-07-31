import React, { useEffect, useState } from 'react';
import { AppThemeProviders } from '../contexts/AppThemeProviders';
import { PublicThemeProviders } from '../contexts/PublicThemeProviders';

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
    const isApp = path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth') || path === '/';
    return isApp;
  };
  
  const [isAppRoute, setIsAppRoute] = useState(getIsAppRoute);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Ensure hydration is complete
    setIsHydrated(true);
    
    // Listen for navigation changes only
    const handleNavigation = () => {
      const path = window.location.pathname;
      const isApp = path.startsWith('/app') || path.startsWith('/setup') || path.startsWith('/mobile') || path.startsWith('/auth') || path === '/';
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
  
  // Show loading until hydration is complete for app routes to prevent provider context issues
  if (isAppRoute && !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For app routes, use the theme provider
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