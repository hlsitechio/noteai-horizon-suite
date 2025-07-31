import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { detectBrowser } from '@/utils/browserDetection';

interface DeviceRouterProps {
  children: React.ReactNode;
}

export const DeviceRouter: React.FC<DeviceRouterProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const browserInfo = detectBrowser();
    const currentPath = location.pathname;
    
    // Don't redirect on auth, public, or setup pages
    const isAuthRoute = currentPath.startsWith('/auth');
    const isPublicRoute = currentPath.startsWith('/public') || currentPath === '/';
    const isSetupRoute = currentPath.startsWith('/setup');
    
    if (isAuthRoute || isPublicRoute || isSetupRoute) {
      return;
    }
    
    // Check if user is on mobile device/browser
    if (isMobile && browserInfo.isMobile) {
      // If user is on mobile but not on mobile routes, redirect to mobile
      if (!currentPath.startsWith('/mobile')) {
        // Preserve the current app route context when redirecting to mobile
        if (currentPath.startsWith('/app/')) {
          const appRoute = currentPath.replace('/app/', '');
          navigate(`/mobile/${appRoute}`, { replace: true });
        } else {
          navigate('/mobile/dashboard', { replace: true });
        }
      }
    } else if (!isMobile && !browserInfo.isMobile) {
      // If user is on desktop but on mobile routes, redirect to desktop
      if (currentPath.startsWith('/mobile')) {
        const mobileRoute = currentPath.replace('/mobile/', '');
        if (mobileRoute && mobileRoute !== '/mobile') {
          navigate(`/app/${mobileRoute}`, { replace: true });
        } else {
          navigate('/app/dashboard', { replace: true });
        }
      }
    }
  }, [isMobile, navigate, location.pathname]);
  
  return <>{children}</>;
};