import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SelectedComponent {
  id: string;
  componentKey: string;
  name: string;
  addedAt: Date;
}

export const useSelectedComponents = () => {
  const { user } = useAuth();
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (user) {
      const storageKey = `selectedComponents_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert addedAt strings back to Date objects and validate structure
          const components = parsed
            .filter((comp: any) => comp && typeof comp === 'object' && comp.id && comp.componentKey && comp.name)
            .map((comp: any) => ({
              id: comp.id,
              componentKey: comp.componentKey,
              name: comp.name,
              addedAt: new Date(comp.addedAt || Date.now())
            }));
          setSelectedComponents(components);
        } catch (error) {
          console.error('Failed to load selected components:', error);
        }
      }
    }
  }, [user]);

  // Save to localStorage whenever components change
  useEffect(() => {
    if (user && selectedComponents.length >= 0) {
      const storageKey = `selectedComponents_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(selectedComponents));
    }
  }, [selectedComponents, user]);

  const addComponent = (component: Omit<SelectedComponent, 'id' | 'addedAt'>) => {
    const newComponent: SelectedComponent = {
      ...component,
      id: `${component.componentKey}-${Date.now()}`,
      addedAt: new Date()
    };
    
    // Remove any existing component with the same componentKey before adding the new one
    setSelectedComponents(prev => {
      const filtered = prev.filter(comp => comp.componentKey !== component.componentKey);
      return [...filtered, newComponent];
    });
    return newComponent;
  };

  const removeComponent = (componentId: string) => {
    setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId));
  };

  const clearAll = () => {
    setSelectedComponents([]);
  };

  const hasComponent = (componentKey: string) => {
    return selectedComponents.some(comp => comp.componentKey === componentKey);
  };

  return {
    selectedComponents,
    addComponent,
    removeComponent,
    clearAll,
    hasComponent
  };
};