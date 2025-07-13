import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface DashboardComponent {
  id: string;
  component_key: string;
  component_name: string;
  component_description?: string;
  category: string;
  is_active: boolean;
  default_props?: Json;
}

export interface PanelConfiguration {
  component_key: string;
  props?: Json;
  enabled: boolean;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  layout_name: string;
  panel_configurations: Json;
  panel_sizes: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class DashboardLayoutService {
  static async getAvailableComponents(): Promise<DashboardComponent[]> {
    try {
      const { data, error } = await supabase
        .from('dashboard_components')
        .select('*')
        .eq('is_enabled', true);

      if (error) throw error;
      
      return data?.map(component => {
        const config = component.component_config as any || {};
        return {
          id: component.id,
          component_key: component.component_type,
          component_name: component.component_type,
          component_description: config.description || '',
          category: config.category || 'general',
          is_active: component.is_enabled || false,
          default_props: component.component_config
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching available components:', error);
      return [];
    }
  }

  static async getUserLayout(userId: string): Promise<DashboardLayout | null> {
    try {
      const { data, error } = await supabase
        .from('dashboard_layouts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default layout if none exists
        return await this.createDefaultLayout(userId);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        layout_name: data.name,
        panel_configurations: data.layout_config,
        panel_sizes: data.layout_config,
        is_active: data.is_default || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user layout:', error);
      return null;
    }
  }

  static async createDefaultLayout(userId: string): Promise<DashboardLayout | null> {
    try {
      const defaultConfig = {
        components: {},
        panelSizes: {},
        gridLayout: []
      };

      const { data, error } = await supabase
        .from('dashboard_layouts')
        .insert({
          user_id: userId,
          name: 'Default Layout',
          layout_config: defaultConfig,
          is_default: true
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        layout_name: data.name,
        panel_configurations: data.layout_config,
        panel_sizes: data.layout_config,
        is_active: data.is_default || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error creating default layout:', error);
      return null;
    }
  }

  static async updateLayout(layoutId: string, updates: Partial<DashboardLayout>): Promise<DashboardLayout> {
    try {
      const updateData: any = {};
      
      if (updates.layout_name) updateData.name = updates.layout_name;
      if (updates.panel_configurations) updateData.layout_config = updates.panel_configurations;
      if (updates.is_active !== undefined) updateData.is_default = updates.is_active;

      const { data, error } = await supabase
        .from('dashboard_layouts')
        .update(updateData)
        .eq('id', layoutId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        layout_name: data.name,
        panel_configurations: data.layout_config,
        panel_sizes: data.layout_config,
        is_active: data.is_default || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error updating layout:', error);
      throw error;
    }
  }

  static async updatePanelConfiguration(
    layoutId: string, 
    panelKey: string, 
    configuration: PanelConfiguration
  ): Promise<void> {
    try {
      console.log('updatePanelConfiguration DB call:', { layoutId, panelKey, configuration });
      
      // Get current layout
      const { data: layout, error: fetchError } = await supabase
        .from('dashboard_layouts')
        .select('layout_config')
        .eq('id', layoutId)
        .single();

      if (fetchError) {
        console.error('Error fetching layout:', fetchError);
        throw fetchError;
      }

      console.log('Current layout from DB:', layout);

      const currentConfig = layout.layout_config as any || {};
      const components = currentConfig.components || {};
      
      components[panelKey] = configuration;

      const newConfig = { 
        ...currentConfig, 
        components 
      };

      console.log('Updating DB with new config:', newConfig);

      const { error: updateError } = await supabase
        .from('dashboard_layouts')
        .update({ 
          layout_config: newConfig
        })
        .eq('id', layoutId);

      if (updateError) {
        console.error('Error updating layout:', updateError);
        throw updateError;
      }

      console.log('Successfully updated layout in DB');
    } catch (error) {
      console.error('Error updating panel configuration:', error);
      throw error;
    }
  }

  static async updatePanelSizes(layoutId: string, sizes: Record<string, number>): Promise<void> {
    try {
      // Get current layout
      const { data: layout, error: fetchError } = await supabase
        .from('dashboard_layouts')
        .select('layout_config')
        .eq('id', layoutId)
        .single();

      if (fetchError) throw fetchError;

      const currentConfig = layout.layout_config as any || {};
      
      const { error: updateError } = await supabase
        .from('dashboard_layouts')
        .update({ 
          layout_config: { 
            ...currentConfig, 
            panelSizes: sizes 
          } 
        })
        .eq('id', layoutId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating panel sizes:', error);
      throw error;
    }
  }

  static async cleanupDuplicateLayouts(userId: string): Promise<void> {
    try {
      // Get all layouts for user
      const { data: layouts, error: fetchError } = await supabase
        .from('dashboard_layouts')
        .select('id, is_default, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      if (!layouts || layouts.length <= 1) return;

      // Keep only the most recent default layout
      const defaultLayouts = layouts.filter(l => l.is_default);
      if (defaultLayouts.length > 1) {
        const toDelete = defaultLayouts.slice(0, -1);
        const { error: deleteError } = await supabase
          .from('dashboard_layouts')
          .delete()
          .in('id', toDelete.map(l => l.id));

        if (deleteError) throw deleteError;
      }
    } catch (error) {
      console.error('Error cleaning up duplicate layouts:', error);
    }
  }
}