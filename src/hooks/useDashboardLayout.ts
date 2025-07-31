import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DashboardComponentService, 
  DashboardPanelService,
  type DashboardComponent,
  type PanelConfiguration 
} from '@/services/dashboard';
import { DashboardLayoutService } from '@/services/dashboardLayoutService';
import type { DashboardLayout } from '@/types/dashboard';
import { DashboardSettingsService } from '@/services/dashboardSettingsService';
import { toast } from 'sonner';


export const useDashboardLayout = () => {
  const { user } = useAuth();
  const [layout, setLayout] = useState<any | null>(null);
  const [availableComponents, setAvailableComponents] = useState<DashboardComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLayout = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading dashboard layout for user:', user.id);

      // Load user's layout with robust service (includes caching and deduplication)
      const userLayout = await DashboardLayoutService.getUserLayout(user.id);

      if (userLayout) {
        // Transform to expected format
        const transformedLayout = {
          id: userLayout.id,
          user_id: userLayout.user_id,
          layout_name: userLayout.name,
          panel_configurations: userLayout.layout_config,
          panel_sizes: userLayout.layout_config,
          is_active: userLayout.is_default || false,
          created_at: userLayout.created_at,
          updated_at: userLayout.updated_at
        };
        setLayout(transformedLayout);
        console.log('✅ Dashboard layout loaded successfully');
      } else {
        console.log('📝 Creating default dashboard layout');
        // Create default layout if none exists
        const defaultConfig = {
          components: {},
          panelSizes: {},
          gridLayout: []
        };
        
        const newLayout = await DashboardLayoutService.createLayout(user.id, defaultConfig);
        if (newLayout) {
          const transformedLayout = {
            id: newLayout.id,
            user_id: newLayout.user_id,
            layout_name: newLayout.name,
            panel_configurations: newLayout.layout_config,
            panel_sizes: newLayout.layout_config,
            is_active: newLayout.is_default || false,
            created_at: newLayout.created_at,
            updated_at: newLayout.updated_at
          };
          setLayout(transformedLayout);
          console.log('✅ Default dashboard layout created');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard layout';
      setError(errorMessage);
      console.error('Dashboard layout error:', err);
      // Don't show toast for network errors to prevent spam
      if (!errorMessage.includes('network') && !errorMessage.includes('fetch')) {
        toast.error(errorMessage);
      }
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
      // Ensure panelConfigs is always an object, not an array
      const panelConfigs = Array.isArray(layoutConfig?.components) ? {} : (layoutConfig?.components || {});
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

      // OPTIMIZED: Single database call to update entire layout config
      // Instead of multiple calls, update the complete layout configuration at once
      const newLayoutConfig = { ...layoutConfig, components: updatedConfigs };
      
      await DashboardLayoutService.updateLayout(layout.id, {
        layout_config: newLayoutConfig
      });

      // Update local state
      const updatedLayout = { ...layout };
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
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    if (user?.id && isMounted) {
      // Debounce the layout loading to prevent rapid successive calls
      timeoutId = setTimeout(() => {
        if (isMounted) {
          loadLayout();
          loadAvailableComponents();
        }
      }, 100);
    }
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user?.id]); // Only depend on user ID to prevent infinite loops

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