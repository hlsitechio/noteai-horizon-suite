// Shared sidebar state management hook
import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface SidebarStateConfig {
  defaultExpandedSections?: string[];
  persistState?: boolean;
  storageKey?: string;
  isCollapsed?: boolean;
}

export function useSidebarState(config: SidebarStateConfig = {}) {
  const isMobile = useIsMobile();
  const isCollapsed = config.isCollapsed || false;

  const {
    defaultExpandedSections = [],
    persistState = true,
    storageKey = 'sidebar-expanded-sections'
  } = config;

  // Initialize expanded sections from localStorage or defaults
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load sidebar state from localStorage:', error);
      }
    }
    
    // Return default state
    return defaultExpandedSections.reduce((acc, section) => {
      acc[section] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Persist state to localStorage
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(expandedSections));
      } catch (error) {
        console.warn('Failed to save sidebar state to localStorage:', error);
      }
    }
  }, [expandedSections, persistState, storageKey]);

  const toggleSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  const expandSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: true
    }));
  }, []);

  const collapseSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: false
    }));
  }, []);

  const expandAllSections = useCallback(() => {
    setExpandedSections(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        newState[key] = true;
      });
      return newState;
    });
  }, []);

  const collapseAllSections = useCallback(() => {
    setExpandedSections(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        newState[key] = false;
      });
      return newState;
    });
  }, []);

  const isSectionExpanded = useCallback((sectionKey: string) => {
    return Boolean(expandedSections[sectionKey]);
  }, [expandedSections]);

  return {
    // State
    isCollapsed,
    isMobile,
    expandedSections,
    
    // Actions
    toggleSection,
    expandSection,
    collapseSection,
    expandAllSections,
    collapseAllSections,
    
    // Helpers
    isSectionExpanded
  };
}