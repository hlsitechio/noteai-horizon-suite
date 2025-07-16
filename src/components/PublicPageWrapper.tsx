import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PublicThemeProvider } from '../providers/PublicThemeProvider';
import { LandingThemeProvider } from '@/contexts/LandingThemeContext';

interface PublicPageWrapperProps {
  children: React.ReactNode;
}

/**
 * Lightweight wrapper for public pages that only loads essential providers
 * Avoids heavy app providers that aren't needed for landing/auth pages
 */
export const PublicPageWrapper: React.FC<PublicPageWrapperProps> = ({ children }) => {
  return (
    <PublicThemeProvider>
      <LandingThemeProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </LandingThemeProvider>
    </PublicThemeProvider>
  );
};