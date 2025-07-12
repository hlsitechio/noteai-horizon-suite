import { useState, useMemo } from 'react';
import { componentLibraryItems, categories } from './ComponentLibraryData';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { toast } from 'sonner';

export const useComponentLibrary = (availablePanels: string[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { updatePanelConfiguration } = useDashboardLayout();

  const filteredComponents = useMemo(() => {
    return componentLibraryItems.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleAddToPanel = async (componentKey: string, panelKey: string) => {
    try {
      // Use setTimeout to defer DOM updates and prevent forced reflow
      await new Promise(resolve => setTimeout(resolve, 0));
      
      await updatePanelConfiguration(panelKey, componentKey, true);
      
      // Defer toast notification to next frame
      requestAnimationFrame(() => {
        toast.success(`Component added to ${panelKey.replace(/([A-Z])/g, ' $1').trim()} panel`);
      });
    } catch (error) {
      console.error('Failed to add component:', error);
      requestAnimationFrame(() => {
        toast.error('Failed to add component to panel');
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