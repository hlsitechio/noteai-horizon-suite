// Main export file for refactored sidebar components
export * from './types';
export * from './animations';
export { 
  SidebarUserProfile, 
  SidebarActionButton, 
  SidebarListItem as SidebarListItemComponent, 
  SidebarSection 
} from './components';
export * from './hooks/useSidebarState';
export * from './hooks/useSidebarActions';

// Legacy exports for backward compatibility
export { SidebarMain } from './SidebarMain';
export { NotesSection } from './NotesSection';