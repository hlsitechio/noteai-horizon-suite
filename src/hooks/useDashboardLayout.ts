import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayoutService, DashboardLayout, DashboardComponent } from '@/services/dashboardLayoutService';
import { toast } from 'sonner';

export const useDashboardLayout = () => {
  const { user } = useAuth();
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [availableComponents, setAvailableComponents] = useState<DashboardComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLayout = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // First cleanup any duplicate active layouts
      await DashboardLayoutService.cleanupDuplicateLayouts(user.id);

      // Load user's layout
      const userLayout = await DashboardLayoutService.getUserLayout(user.id);

      setLayout(userLayout);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard layout';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableComponents = async () => {
    try {
      const components = await DashboardLayoutService.getAvailableComponents();
      setAvailableComponents(components);
    } catch (err) {
      console.error('Failed to load available components:', err);
    }
  };

  const updatePanelConfiguration = async (panelKey: string, componentKey: string, enabled: boolean) => {
    if (!layout) return;

    try {
      await DashboardLayoutService.updatePanelConfiguration(layout.id, panelKey, {
        component_key: componentKey,
        enabled,
        props: {}
      });

      // Update local state
      const updatedLayout = { ...layout };
      const panelConfigs = updatedLayout.panel_configurations as Record<string, any> || {};
      panelConfigs[panelKey] = {
        component_key: componentKey,
        enabled,
        props: {}
      };
      updatedLayout.panel_configurations = panelConfigs as any;
      
      setLayout(updatedLayout);
      toast.success('Panel configuration updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update panel configuration';
      toast.error(errorMessage);
    }
  };

  const updatePanelSizes = async (sizes: Record<string, number>) => {
    if (!layout) return;

    try {
      await DashboardLayoutService.updatePanelSizes(layout.id, sizes);
      
      // Update local state
      const updatedLayout = { ...layout };
      updatedLayout.panel_sizes = sizes as any;
      setLayout(updatedLayout);
    } catch (err) {
      console.error('Failed to update panel sizes:', err);
    }
  };

  const getPanelConfiguration = (panelKey: string) => {
    if (!layout) return null;
    const configs = layout.panel_configurations as Record<string, any>;
    return configs?.[panelKey] || null;
  };

  const getPanelSizes = () => {
    if (!layout) return {};
    return layout.panel_sizes as Record<string, number> || {};
  };

  useEffect(() => {
    if (user) {
      loadLayout();
      loadAvailableComponents();
    }
  }, [user]);

  return {
    layout,
    availableComponents,
    isLoading,
    error,
    updatePanelConfiguration,
    updatePanelSizes,
    getPanelConfiguration,
    getPanelSizes,
    refreshLayout: loadLayout
  };
};