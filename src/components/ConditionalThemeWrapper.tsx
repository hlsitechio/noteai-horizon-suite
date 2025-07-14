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
  const [isAppRoute, setIsAppRoute] = useState(false);
  
  useEffect(() => {
    // Check if we're on an app route without using useLocation
    const checkRoute = () => {
      setIsAppRoute(window.location.pathname.startsWith('/app'));
    };
    
    // Initial check
    checkRoute();
    
    // Listen for navigation changes
    const handleNavigation = () => {
      checkRoute();
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