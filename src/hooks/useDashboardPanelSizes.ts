import { useCallback, useRef, useEffect } from 'react';
import { useDashboardSettings } from './useDashboardSettings';
import { useEditMode } from '@/contexts/EditModeContext';
import { toast } from 'sonner';

export const useDashboardPanelSizes = () => {
  const { settings, updateSidebarPanelSizes } = useDashboardSettings();
  const { isSidebarEditMode, setIsSidebarEditMode } = useEditMode();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Get saved panel sizes from settings
  const settingsPanelSizes = settings?.sidebar_panel_sizes || {};
  
  const panelSizes = {
    banner: settingsPanelSizes.banner || 25,
    analytics: settingsPanelSizes.analytics || 30,
    topSection: settingsPanelSizes.topSection || 35,
    bottomSection: settingsPanelSizes.bottomSection || 35,
    leftPanels: settingsPanelSizes.leftPanels || 50,
    rightPanels: settingsPanelSizes.rightPanels || 50,
  };

  // Debounced save function
  const debouncedSave = useCallback((newSizes: Record<string, number>) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      console.log('Saving panel sizes:', newSizes);
      const success = await updateSidebarPanelSizes(newSizes);
      if (success) {
        console.log('Panel sizes saved successfully:', newSizes);
        
        // Auto-exit sidebar edit mode after successful save
        if (isSidebarEditMode) {
          setIsSidebarEditMode(false);
          toast.success('Sidebar layout saved and locked');
        }
      } else {
        console.error('Failed to save panel sizes');
        toast.error('Failed to save sidebar layout');
      }
    }, 500); // 500ms debounce
  }, [updateSidebarPanelSizes, isSidebarEditMode, setIsSidebarEditMode]);

  const createSizeHandler = (sizeKey: string) => (sizes: number[]) => {
    const newSizes = { ...settingsPanelSizes };
    
    switch (sizeKey) {
      case 'banner':
        if (sizes.length >= 2) newSizes.banner = sizes[0];
        break;
      case 'mainContent':
        if (sizes.length >= 3) {
          newSizes.analytics = sizes[0];
          newSizes.topSection = sizes[1];
          newSizes.bottomSection = sizes[2];
        }
        break;
      case 'horizontal':
        if (sizes.length >= 2) {
          newSizes.leftPanels = sizes[0];
          newSizes.rightPanels = sizes[1];
        }
        break;
    }
    
    debouncedSave(newSizes);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    panelSizes,
    handleBannerResize: createSizeHandler('banner'),
    handleMainContentResize: createSizeHandler('mainContent'),
    handleHorizontalResize: createSizeHandler('horizontal'),
  };
};