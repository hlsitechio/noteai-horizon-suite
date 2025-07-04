import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { OptimizedNotesProvider } from '../contexts/OptimizedNotesContext';
import { FoldersProvider } from '../contexts/FoldersContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { AccentColorProvider } from '../contexts/AccentColorContext';
import { DynamicAccentProvider } from '../contexts/DynamicAccentContext';
import { ProjectRealmsProvider } from '../contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from '../contexts/FloatingNotesContext';
import { QuantumAIProvider } from '../contexts/QuantumAIContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Optimized providers wrapper that reduces nesting depth
 * and improves performance by grouping related providers
 */
export const AppProviders: React.FC<AppProvidersProps> = React.memo(({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme">
      <TooltipProvider>
        <AuthProvider>
          <AccentColorProvider>
            <DynamicAccentProvider>
              <NotificationsProvider>
                <FoldersProvider>
                  <OptimizedNotesProvider>
                    <ProjectRealmsProvider>
                      <FloatingNotesProvider>
                        <QuantumAIProvider>
                          {children}
                        </QuantumAIProvider>
                      </FloatingNotesProvider>
                    </ProjectRealmsProvider>
                  </OptimizedNotesProvider>
                </FoldersProvider>
              </NotificationsProvider>
            </DynamicAccentProvider>
          </AccentColorProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
});

AppProviders.displayName = 'AppProviders';