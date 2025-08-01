import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useDashboardWorkspace } from './useDashboardWorkspace';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDebounceCallback } from '@/lib/performance';
import { toast } from 'sonner';

export const useDashboardPanelSizes = () => {
  const { workspace, updatePanelSizes } = useDashboardWorkspace();
  const { handlePanelSizeSave } = useEditMode();
  const hasUserInteractedRef = useRef(false);
  
  // Get saved panel sizes from settings
  const settingsPanelSizes = workspace?.panel_sizes || {};
  
  const panelSizes = useMemo(() => ({
    banner: settingsPanelSizes.banner || 30,
    analytics: settingsPanelSizes.analytics || 30,
    topSection: settingsPanelSizes.topSection || 40,
    bottomSection: settingsPanelSizes.bottomSection || 30,
    leftPanels: settingsPanelSizes.leftPanels || 50,
    rightPanels: settingsPanelSizes.rightPanels || 50,
  }), [settingsPanelSizes]);


  // Track when user actually interacts with panels
  const trackUserInteraction = useCallback(() => {
    hasUserInteractedRef.current = true;
  }, []);

  // Optimized debounced save function
  const debouncedSave = useDebounceCallback(async (newSizes: Record<string, number>) => {
    const success = await updatePanelSizes(newSizes);
    
    if (success) {
      toast.success('Dashboard layout saved');
      
      // Auto-lock edit modes after successful save (only if user interacted)
      if (hasUserInteractedRef.current) {
        await handlePanelSizeSave();
      }
    } else {
      toast.error('Failed to save dashboard layout');
    }
  }, 500);

  const createSizeHandler = useCallback((sizeKey: string) => (sizes: number[]) => {
    // Track user interaction
    trackUserInteraction();
    
    const newSizes = { ...settingsPanelSizes };
    
    switch (sizeKey) {
      case 'banner':
        if (sizes.length >= 2) newSizes.banner = Math.round(sizes[0]);
        break;
      case 'mainContent':
        if (sizes.length >= 3) {
          newSizes.analytics = Math.round(sizes[0]);
          newSizes.topSection = Math.round(sizes[1]);
          newSizes.bottomSection = Math.round(sizes[2]);
        }
        break;
      case 'horizontal':
        if (sizes.length >= 2) {
          newSizes.leftPanels = Math.round(sizes[0]);
          newSizes.rightPanels = Math.round(sizes[1]);
        }
        break;
    }
    
    debouncedSave(newSizes);
  }, [settingsPanelSizes, debouncedSave, trackUserInteraction]);

  // Remove the cleanup as it's handled by useDebounceCallback

  const handlers = useMemo(() => ({
    handleBannerResize: createSizeHandler('banner'),
    handleMainContentResize: createSizeHandler('mainContent'),
    handleHorizontalResize: createSizeHandler('horizontal'),
  }), [createSizeHandler]);

  return {
    panelSizes,
    ...handlers,
    trackUserInteraction,
  };
};