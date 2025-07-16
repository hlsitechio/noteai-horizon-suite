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
    return window.location.pathname.startsWith('/app');
  };
  
  const [isAppRoute, setIsAppRoute] = useState(getIsAppRoute);
  
  useEffect(() => {
    // Listen for navigation changes only
    const handleNavigation = () => {
      setIsAppRoute(window.location.pathname.startsWith('/app'));
    };
    
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);
  
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