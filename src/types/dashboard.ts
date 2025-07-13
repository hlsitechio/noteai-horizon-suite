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