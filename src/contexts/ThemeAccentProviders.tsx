import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConditionalThemeProvider } from '../providers/ConditionalThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Theme and styling related providers grouped together
 * for better organization and performance
 * Now uses ConditionalThemeProvider to separate public/app themes
 */
export const ThemeAccentProviders = composeProviders(
  ConditionalThemeProvider,
  TooltipProvider,
  AccentColorProvider,
  DynamicAccentProvider
);