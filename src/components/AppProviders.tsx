import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeAccentProviders } from '../contexts/ThemeAccentProviders';
import { NotesDataProviders } from '../contexts/NotesDataProviders';
import { ProjectAIProviders } from '../contexts/ProjectAIProviders';
import { composeProviders } from '../utils/composeProviders';

// Compose all main providers in a flattened tree structure
const RootProviders = composeProviders(
  ThemeAccentProviders,
  AuthProvider,
  NotesDataProviders,
  ProjectAIProviders
);

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Optimized providers wrapper using modern composition pattern
 * - Flatter provider tree for better performance
 * - Logical grouping by concern
 * - Easier to maintain and extend
 * - Improved React reconciliation performance
 */
export const AppProviders: React.FC<AppProvidersProps> = React.memo(({ children }) => (
  <RootProviders>{children}</RootProviders>
));

AppProviders.displayName = 'AppProviders';