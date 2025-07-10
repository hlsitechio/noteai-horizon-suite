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

// Main unified sidebar export
export { SidebarUnified } from './SidebarUnified';
export { NotesSection } from './NotesSection';