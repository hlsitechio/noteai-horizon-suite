// Re-export all dashboard services for easy importing
export { DashboardComponentService } from './componentService';
export { DashboardLayoutService } from './layoutService';
export { DashboardPanelService } from './panelService';

// Re-export types
export type { DashboardComponent, PanelConfiguration, DashboardLayout } from '@/types/dashboard';