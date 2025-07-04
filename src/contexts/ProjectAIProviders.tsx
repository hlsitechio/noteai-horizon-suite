import React from 'react';
import { ProjectRealmsProvider } from '../contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from '../contexts/FloatingNotesContext';
import { QuantumAIProvider } from '../contexts/QuantumAIContext';
import { composeProviders } from '../utils/composeProviders';

/**
 * Project and AI-related providers grouped together
 * for better organization and performance optimization
 */
export const ProjectAIProviders = composeProviders(
  ProjectRealmsProvider,
  FloatingNotesProvider,
  QuantumAIProvider
);