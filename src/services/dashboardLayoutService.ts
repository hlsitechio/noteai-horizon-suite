// Dashboard layout service - DISABLED
// The dashboard_components and dashboard_layouts tables don't exist in the current database schema

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
    console.warn('Dashboard layout service disabled - dashboard_components table missing from database schema');
    return [];
  }

  static async getUserLayout(userId: string): Promise<DashboardLayout | null> {
    console.warn('Dashboard layout service disabled - dashboard_layouts table missing from database schema');
    return null;
  }

  static async updateLayout(layoutId: string, updates: Partial<DashboardLayout>): Promise<DashboardLayout> {
    console.warn('Dashboard layout service disabled - dashboard_layouts table missing from database schema');
    throw new Error('Dashboard layout service disabled');
  }

  static async updatePanelConfiguration(
    layoutId: string, 
    panelKey: string, 
    configuration: PanelConfiguration
  ): Promise<void> {
    console.warn('Dashboard layout service disabled - dashboard_layouts table missing from database schema');
  }

  static async updatePanelSizes(layoutId: string, sizes: Record<string, number>): Promise<void> {
    console.warn('Dashboard layout service disabled - dashboard_layouts table missing from database schema');
  }

  static async cleanupDuplicateLayouts(userId: string): Promise<void> {
    console.warn('Dashboard layout service disabled - dashboard_layouts table missing from database schema');
  }
}