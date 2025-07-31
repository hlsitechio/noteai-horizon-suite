// Re-export all dashboard services for easy importing
export { DashboardComponentService } from './componentService';
export { DashboardPanelService } from './panelService';
// Note: DashboardLayoutService is exported from '@/services/dashboardLayoutService' (robust version)

// Re-export types
export type { DashboardComponent, PanelConfiguration, DashboardLayout } from '@/types/dashboard';