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
    const { data, error } = await supabase
      .from('dashboard_components')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('component_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getUserLayout(userId: string): Promise<DashboardLayout | null> {
    // Get the most recent active layout for the user
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }


  static async updateLayout(layoutId: string, updates: Partial<DashboardLayout>): Promise<DashboardLayout> {
    const { data, error } = await supabase
      .from('dashboard_layouts')
      .update(updates)
      .eq('id', layoutId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePanelConfiguration(
    layoutId: string, 
    panelKey: string, 
    configuration: PanelConfiguration
  ): Promise<void> {
    // First get the current layout
    const { data: layout, error: fetchError } = await supabase
      .from('dashboard_layouts')
      .select('panel_configurations')
      .eq('id', layoutId)
      .single();

    if (fetchError) throw fetchError;

    // Update the specific panel configuration
    const currentConfigs = layout.panel_configurations as Record<string, any> || {};
    const updatedConfigurations = {
      ...currentConfigs,
      [panelKey]: configuration
    } as Json;

    const { error: updateError } = await supabase
      .from('dashboard_layouts')
      .update({ panel_configurations: updatedConfigurations })
      .eq('id', layoutId);

    if (updateError) throw updateError;
  }

  static async updatePanelSizes(layoutId: string, sizes: Record<string, number>): Promise<void> {
    const { error } = await supabase
      .from('dashboard_layouts')
      .update({ panel_sizes: sizes as Json })
      .eq('id', layoutId);

    if (error) throw error;
  }

  static async cleanupDuplicateLayouts(userId: string): Promise<void> {
    // Get all active layouts for user, ordered by most recent first
    const { data: layouts, error: fetchError } = await supabase
      .from('dashboard_layouts')
      .select('id, updated_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (fetchError) throw fetchError;

    // If there are multiple active layouts, deactivate all but the most recent
    if (layouts && layouts.length > 1) {
      const layoutsToDeactivate = layouts.slice(1).map(layout => layout.id);
      
      const { error: updateError } = await supabase
        .from('dashboard_layouts')
        .update({ is_active: false })
        .in('id', layoutsToDeactivate);

      if (updateError) throw updateError;
    }
  }
}