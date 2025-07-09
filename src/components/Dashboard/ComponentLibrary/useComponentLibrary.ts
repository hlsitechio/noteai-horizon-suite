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
      await updatePanelConfiguration(panelKey, componentKey, true);
      toast.success(`Component added to ${panelKey} panel`);
    } catch (error) {
      console.error('Failed to add component:', error);
      toast.error('Failed to add component to panel');
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