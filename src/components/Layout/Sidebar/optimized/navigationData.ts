// Centralized navigation configuration
export const navigationItems = [
  // Main Navigation
  { 
    icon: 'bx bx-grid-alt', 
    label: 'Dashboard', 
    path: '/app/dashboard',
    category: 'main',
    description: 'Overview and quick actions'
  },
  { 
    icon: 'bx bx-folder-open', 
    label: 'Explorer', 
    path: '/app/explorer',
    category: 'main',
    description: 'Browse and search content'
  },
  { 
    icon: 'bx bx-folder', 
    label: 'Projects', 
    path: '/app/projects',
    category: 'main',
    description: 'Manage project realms'
  },
  { 
    icon: 'bx bx-edit', 
    label: 'Editor', 
    path: '/app/editor',
    category: 'main',
    description: 'Create and edit content'
  },
  { 
    icon: 'bx bx-message-rounded', 
    label: 'AI Chat', 
    path: '/app/chat',
    category: 'main',
    description: 'AI-powered conversations'
  },
  { 
    icon: 'bx bx-calendar', 
    label: 'Calendar', 
    path: '/app/calendar',
    category: 'main',
    description: 'Schedule and manage events'
  },


] as const;

export type NavigationItem = typeof navigationItems[number];