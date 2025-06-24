
import { useContext } from 'react';
import { ProjectRealmsContext } from '../contexts/ProjectRealmsContext';

export const useProjects = () => {
  const context = useContext(ProjectRealmsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectRealmsProvider');
  }
  return context;
};
