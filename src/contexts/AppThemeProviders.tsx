import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';

interface AppThemeProvidersProps {
  children: React.ReactNode;
}

/**
 * Theme and styling providers for APP pages
 * Used when Router context is available
 */
export const AppThemeProviders: React.FC<AppThemeProvidersProps> = ({ children }) => (
  <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme">
    <TooltipProvider>
      <AccentColorProvider>
        <DynamicAccentProvider>
          {children}
        </DynamicAccentProvider>
      </AccentColorProvider>
    </TooltipProvider>
  </ThemeProvider>
);