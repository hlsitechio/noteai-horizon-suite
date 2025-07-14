import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Theme and styling providers for APP pages
 * Used when Router context is available
 */
export const AppThemeProviders = composeProviders(
  (props) => <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme" {...props} />,
  TooltipProvider,
  AccentColorProvider,
  DynamicAccentProvider
);