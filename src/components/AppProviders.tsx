import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeAccentProviders } from '../contexts/ThemeAccentProviders';
import { NotesDataProviders } from '../contexts/NotesDataProviders';
import { ProjectAIProviders } from '../contexts/ProjectAIProviders';
import { EditModeProvider } from '../contexts/EditModeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Optimized providers wrapper using direct nesting to avoid hook issues
 * - Simple provider tree structure
 * - Logical grouping by concern
 * - Avoids composeProviders utility that can cause React context issues
 * - Improved React reconciliation performance
 */
export const AppProviders: React.FC<AppProvidersProps> = React.memo(({ children }) => (
  <ThemeAccentProviders>
    <AuthProvider>
      <NotesDataProviders>
        <ProjectAIProviders>
          <EditModeProvider>
            {children}
          </EditModeProvider>
        </ProjectAIProviders>
      </NotesDataProviders>
    </AuthProvider>
  </ThemeAccentProviders>
));

AppProviders.displayName = 'AppProviders';