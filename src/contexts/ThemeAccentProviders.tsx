import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Theme and styling related providers grouped together
 * for better organization and performance
 */
export const ThemeAccentProviders = composeProviders(
  (props) => <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme" {...props} />,
  TooltipProvider,
  AccentColorProvider,
  DynamicAccentProvider
);