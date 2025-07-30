import { supabase } from "@/integrations/supabase/client";
import { PanelConfiguration } from "@/types/dashboard";

export class DashboardPanelService {
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
      // Ensure components is always an object, not an array
      const components = Array.isArray(currentConfig.components) ? {} : (currentConfig.components || {});
      
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
}