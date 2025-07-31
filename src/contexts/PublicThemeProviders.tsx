import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PublicThemeProvider } from '../providers/PublicThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';

interface PublicThemeProvidersProps {
  children: React.ReactNode;
}

/**
 * Theme and styling providers for PUBLIC pages only
 * Used when Router context is not available
 */
export const PublicThemeProviders: React.FC<PublicThemeProvidersProps> = ({ children }) => (
  <PublicThemeProvider>
    <TooltipProvider>
      <AccentColorProvider>
        <DynamicAccentProvider>
          {children}
        </DynamicAccentProvider>
      </AccentColorProvider>
    </TooltipProvider>
  </PublicThemeProvider>
);