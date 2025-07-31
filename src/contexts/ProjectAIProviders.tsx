import React from 'react';
import { ProjectRealmsProvider } from '../contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from '../contexts/FloatingNotesContext';
import { QuantumAIProvider } from '../contexts/QuantumAIContext';

interface ProjectAIProvidersProps {
  children: React.ReactNode;
}

/**
 * Project and AI-related providers grouped together
 * using direct nesting to avoid context issues
 */
export const ProjectAIProviders: React.FC<ProjectAIProvidersProps> = ({ children }) => (
  <ProjectRealmsProvider>
    <FloatingNotesProvider>
      <QuantumAIProvider>
        {children}
      </QuantumAIProvider>
    </FloatingNotesProvider>
  </ProjectRealmsProvider>
);