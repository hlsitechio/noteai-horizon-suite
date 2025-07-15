// Shared types for sidebar components
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Note } from '../../../types/note';
import { Folder } from '../../../types/folder';

// Navigation Types
export interface NavigationItem {
  icon: string; // Boxicon class name
  label: string;
  path: string;
  description: string;
  badge?: number | string;
  isActive?: boolean;
}

// Quick Action Types
export interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  action: () => void;
  color: string;
  'data-onboarding'?: string;
}

// Event Handler Types
export type NavigationClickHandler = (path: string) => void;
export type QuickActionClickHandler = (action: () => void) => void;
export type SidebarToggleHandler = () => void;

// Context Error Types
export interface SidebarContextError {
  message: string;
  context: 'SidebarContext' | 'AccentColorContext';
  fallback?: any;
}

// Component Error Boundary Types
export interface SidebarErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface SidebarErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export interface SidebarActionItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: number | string;
}

export interface SidebarListItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  isActive?: boolean;
  children?: SidebarListItem[];
}

export interface SidebarSectionProps {
  title: string;
  items: SidebarListItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNew?: () => void;
  createLabel?: string;
  emptyStateMessage?: string;
}

export interface UserProfileData {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface SidebarState {
  isCollapsed: boolean;
  expandedSections: Record<string, boolean>;
  isMobile: boolean;
}

export interface AnimationVariants {
  expanded: {
    height: string;
    opacity: number;
    transition?: object;
  };
  collapsed: {
    height: number;
    opacity: number;
    transition?: object;
  };
}

export interface SidebarTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    background: string;
    foreground: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}