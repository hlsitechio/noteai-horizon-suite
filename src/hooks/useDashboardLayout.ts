import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayoutService, DashboardLayout, DashboardComponent } from '@/services/dashboardLayoutService';
import { DashboardSettingsService } from '@/services/dashboardSettingsService';
import { toast } from 'sonner';

interface PanelConfiguration {
  component_key: string;
  enabled: boolean;
  props: Record<string, unknown>;
}

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
      // Make database update first
      await DashboardLayoutService.updatePanelConfiguration(layout.id, panelKey, {
        component_key: componentKey,
        enabled,
        props: {}
      });

      // Batch state updates using React's automatic batching
      await new Promise(resolve => {
        // Update local state
        const updatedLayout = { ...layout };
        const panelConfigs = (updatedLayout.panel_configurations as unknown as Record<string, PanelConfiguration>) || {};
        panelConfigs[panelKey] = {
          component_key: componentKey,
          enabled,
          props: {}
        };
        updatedLayout.panel_configurations = panelConfigs as any;
        
        setLayout(updatedLayout);
        resolve(void 0);
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update panel configuration';
      throw new Error(errorMessage);
    }
  };

  const updatePanelSizes = async (sizes: Record<string, number>) => {
    if (!user) return;

    // Store panel sizes in dashboard settings instead of layout
    try {
      const success = await DashboardSettingsService.updateSidebarPanelSizes(user.id, sizes);
      
      if (success) {
        // Update local layout state if it exists
        if (layout) {
          const updatedLayout = { ...layout };
          updatedLayout.panel_sizes = sizes as any;
          setLayout(updatedLayout);
        }
        
        console.log('Panel sizes saved successfully:', sizes);
      } else {
        console.error('Failed to save panel sizes');
        toast.error('Failed to save panel layout');
      }
    } catch (err) {
      console.error('Failed to update panel sizes:', err);
      toast.error('Failed to save panel layout');
    }
  };

  const getPanelConfiguration = (panelKey: string) => {
    if (!layout) return null;
    const configs = layout.panel_configurations as unknown as Record<string, PanelConfiguration>;
    return configs?.[panelKey] || null;
  };

  const getPanelSizes = () => {
    if (layout && layout.panel_sizes) {
      return layout.panel_sizes as Record<string, number>;
    }
    // Fallback to empty object - panel sizes will use defaults
    return {};
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