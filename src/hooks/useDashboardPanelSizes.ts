import { useDashboardLayout } from './useDashboardLayout';

export const useDashboardPanelSizes = () => {
  const { getPanelSizes, updatePanelSizes } = useDashboardLayout();
  
  const savedPanelSizes = getPanelSizes();
  
  const panelSizes = {
    banner: savedPanelSizes.banner || 40,
    analytics: savedPanelSizes.analytics || 30,
    topSection: savedPanelSizes.topSection || 35,
    bottomSection: savedPanelSizes.bottomSection || 35,
    leftPanels: savedPanelSizes.leftPanels || 50,
    rightPanels: savedPanelSizes.rightPanels || 50,
  };

  const createSizeHandler = (sizeKey: string) => (sizes: number[]) => {
    const newSizes = { ...savedPanelSizes };
    
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
    
    updatePanelSizes(newSizes);
  };

  return {
    panelSizes,
    handleBannerResize: createSizeHandler('banner'),
    handleMainContentResize: createSizeHandler('mainContent'),
    handleHorizontalResize: createSizeHandler('horizontal'),
  };
};