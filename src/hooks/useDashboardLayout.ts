import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DashboardLayoutService, 
  DashboardComponentService, 
  DashboardPanelService,
  type DashboardLayout, 
  type DashboardComponent,
  type PanelConfiguration 
} from '@/services/dashboard';
import { DashboardSettingsService } from '@/services/dashboardSettingsService';
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
      const components = await DashboardComponentService.getAvailableComponents();
      setAvailableComponents(components);
    } catch (err) {
      console.error('Failed to load available components:', err);
    }
  };

  const updatePanelConfiguration = async (panelKey: string, componentKey: string, enabled: boolean) => {
    if (!layout) return;

    try {
      console.log('updatePanelConfiguration called:', { panelKey, componentKey, enabled });
      
      // First, check if this component type already exists in another panel and remove it
      const layoutConfig = layout.panel_configurations as any;
      const panelConfigs = layoutConfig?.components || {};
      console.log('Current panel configs:', panelConfigs);
      
      // Find and clear any existing panels with the same component type
      const updatedConfigs = { ...panelConfigs };
      Object.keys(updatedConfigs).forEach(existingPanelKey => {
        if (existingPanelKey !== panelKey && updatedConfigs[existingPanelKey]?.component_key === componentKey) {
          console.log(`Clearing existing component ${componentKey} from panel ${existingPanelKey}`);
          updatedConfigs[existingPanelKey] = {
            component_key: '',
            enabled: false,
            props: {}
          };
        }
      });

      // Set the new panel configuration
      updatedConfigs[panelKey] = {
        component_key: componentKey,
        enabled,
        props: {}
      };

      console.log('Updated configs to save:', updatedConfigs);

      // Make database update with the main panel configuration
      await DashboardPanelService.updatePanelConfiguration(layout.id, panelKey, {
        component_key: componentKey,
        enabled,
        props: {}
      });

      // Update all affected panels in the database
      for (const [key, config] of Object.entries(updatedConfigs)) {
        const typedConfig = config as PanelConfiguration;
        const existingConfig = panelConfigs[key] as PanelConfiguration;
        if (key !== panelKey && existingConfig?.component_key !== typedConfig.component_key) {
          console.log(`Updating panel ${key} with config:`, config);
          await DashboardPanelService.updatePanelConfiguration(layout.id, key, {
            component_key: typedConfig.component_key,
            enabled: typedConfig.enabled,
            props: typedConfig.props as any
          });
        }
      }

      // Update local state
      const updatedLayout = { ...layout };
      const newLayoutConfig = { ...layoutConfig, components: updatedConfigs };
      updatedLayout.panel_configurations = newLayoutConfig as any;
      
      console.log('Setting updated layout:', updatedLayout);
      setLayout(updatedLayout);

    } catch (err) {
      console.error('Failed to update panel configuration:', err);
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
    const layoutConfig = layout.panel_configurations as any;
    const configs = layoutConfig?.components || {};
    return configs[panelKey] || null;
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