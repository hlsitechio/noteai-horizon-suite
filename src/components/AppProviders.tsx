import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { RobustnessProvider } from '../contexts/RobustnessContext';
import { ThemeAccentProviders } from '../contexts/ThemeAccentProviders';
import { NotesDataProviders } from '../contexts/NotesDataProviders';
import { ProjectAIProviders } from '../contexts/ProjectAIProviders';
import { EditModeProvider } from '../contexts/EditModeContext';
import { OnboardingProvider } from './Onboarding/OnboardingProvider';
import { SmartErrorBoundary } from './ErrorBoundary/SmartErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Optimized providers wrapper using direct nesting to avoid hook issues
 * - Simple provider tree structure
 * - Logical grouping by concern
 * - Includes OnboardingProvider inside AuthProvider to fix context issues
 * - Error boundaries for provider-level protection
 * - Improved React reconciliation performance
 */
export const AppProviders: React.FC<AppProvidersProps> = React.memo(({ children }) => (
  <SmartErrorBoundary>
    <RobustnessProvider>
      <ThemeAccentProviders>
        <AuthProvider>
          <NotesDataProviders>
            <ProjectAIProviders>
              <EditModeProvider>
                <OnboardingProvider>
                  {children}
                </OnboardingProvider>
              </EditModeProvider>
            </ProjectAIProviders>
          </NotesDataProviders>
        </AuthProvider>
      </ThemeAccentProviders>
    </RobustnessProvider>
  </SmartErrorBoundary>
));

AppProviders.displayName = 'AppProviders';