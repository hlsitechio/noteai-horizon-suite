import { useState, useMemo } from 'react';
import { processedComponentLibraryItems, categories } from './ComponentLibraryData';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useSelectedComponents } from '@/hooks/useSelectedComponents';
import { toast } from 'sonner';

export const useComponentLibrary = (availablePanels: string[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { updatePanelConfiguration } = useDashboardLayout();
  const { addComponent } = useSelectedComponents();

  const filteredComponents = useMemo(() => {
    return processedComponentLibraryItems.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || 
                             (selectedCategory === 'New' && component.isNew) ||
                             component.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleAddToPanel = async (componentKey: string, panelKey: string) => {
    try {
      // Use setTimeout to defer DOM updates and prevent forced reflow
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (panelKey === 'selectedComponents') {
        // Handle adding to selected components area
        await handleAddToSelectedComponents(componentKey);
      } else {
        // Regular panel addition
        await updatePanelConfiguration(panelKey, componentKey, true);
        
        // Defer toast notification to next frame
        requestAnimationFrame(() => {
          toast.success(`Component added to ${panelKey.replace(/([A-Z])/g, ' $1').trim()} panel`);
        });
      }
    } catch (error) {
      console.error('Failed to add component:', error);
      requestAnimationFrame(() => {
        toast.error('Failed to add component to panel');
      });
    }
  };

  const handleAddToSelectedComponents = async (componentKey: string) => {
    try {
      // Find component details
      const component = processedComponentLibraryItems.find(item => item.componentKey === componentKey);
      if (!component) {
        throw new Error('Component not found');
      }

      // Add to selected components
      addComponent({
        componentKey,
        name: component.name
      });
      
      requestAnimationFrame(() => {
        toast.success(`${component.name} added to selected components`);
      });
    } catch (error) {
      console.error('Failed to add to selected components:', error);
      requestAnimationFrame(() => {
        toast.error('Failed to add component to selected area');
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredComponents,
    handleAddToPanel,
    categories
  };
};