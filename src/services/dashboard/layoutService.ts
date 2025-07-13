import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/types/dashboard";

export class DashboardLayoutService {
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
