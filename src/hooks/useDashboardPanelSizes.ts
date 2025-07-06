import { useDashboardLayout } from './useDashboardLayout';
import { useDashboardSettings } from './useDashboardSettings';

export const useDashboardPanelSizes = () => {
  const { getPanelSizes, updatePanelSizes } = useDashboardLayout();
  const { settings } = useDashboardSettings();
  
  // Get saved panel sizes from both dashboard settings and layout
  const savedPanelSizes = getPanelSizes();
  const settingsPanelSizes = settings?.sidebar_panel_sizes || {};
  
  // Merge both sources, with dashboard settings taking precedence
  const mergedPanelSizes = { ...savedPanelSizes, ...settingsPanelSizes };
  
  const panelSizes = {
    banner: mergedPanelSizes.banner || 25,
    analytics: mergedPanelSizes.analytics || 30,
    topSection: mergedPanelSizes.topSection || 35,
    bottomSection: mergedPanelSizes.bottomSection || 35,
    leftPanels: mergedPanelSizes.leftPanels || 50,
    rightPanels: mergedPanelSizes.rightPanels || 50,
  };

  const createSizeHandler = (sizeKey: string) => (sizes: number[]) => {
    const newSizes = { ...mergedPanelSizes };
    
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
    
    console.log('Saving panel sizes:', newSizes);
    updatePanelSizes(newSizes);
  };

  return {
    panelSizes,
    handleBannerResize: createSizeHandler('banner'),
    handleMainContentResize: createSizeHandler('mainContent'),
    handleHorizontalResize: createSizeHandler('horizontal'),
  };
};