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

  // Tools
  { 
    icon: 'bx bx-bar-chart', 
    label: 'Analytics', 
    path: '/app/analytics',
    category: 'tools',
    description: 'Track productivity metrics'
  },
  { 
    icon: 'bx bx-search-alt', 
    label: 'SEO', 
    path: '/app/seo',
    category: 'tools',
    description: 'Search engine optimization'
  },
  { 
    icon: 'bx bx-list-ul', 
    label: 'Activity', 
    path: '/app/activity',
    category: 'tools',
    description: 'View recent activity'
  },
  { 
    icon: 'bx bx-palette', 
    label: 'Themes', 
    path: '/app/themes',
    category: 'tools',
    description: 'Customize appearance'
  },

] as const;

export type NavigationItem = typeof navigationItems[number];