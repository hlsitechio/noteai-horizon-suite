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
          // Convert addedAt strings back to Date objects
          const components = parsed.map((comp: any) => ({
            ...comp,
            addedAt: new Date(comp.addedAt)
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
    
    setSelectedComponents(prev => [...prev, newComponent]);
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