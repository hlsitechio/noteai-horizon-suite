import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PublicThemeProvider } from '../providers/PublicThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Theme and styling providers for PUBLIC pages only
 * Used when Router context is not available
 */
export const PublicThemeProviders = composeProviders(
  PublicThemeProvider,
  TooltipProvider,
  AccentColorProvider,
  DynamicAccentProvider
);