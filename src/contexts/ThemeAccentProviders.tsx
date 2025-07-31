import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PublicThemeProvider } from '../providers/PublicThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Default theme providers for when Router context is not available
 * This provides a fallback public theme system
 */
export const ThemeAccentProviders = composeProviders(
  PublicThemeProvider,
  TooltipProvider,
  AccentColorProvider,
  DynamicAccentProvider
);