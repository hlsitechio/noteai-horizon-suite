import { supabase } from "@/integrations/supabase/client";
import { DashboardComponent } from "@/types/dashboard";

export class DashboardComponentService {
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
}