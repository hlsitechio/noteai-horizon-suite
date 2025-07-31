import React from 'react';
import { 
  Home, 
  FileText, 
  Edit3, 
  Search, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  FolderOpen,
  Mic,
  Palette,
  Activity,
  Component,
  Bot,
  CheckCircle2
} from 'lucide-react';

export interface RouteConfig {
  path: string;
  label: string;
  icon: any;
  main: () => React.ReactElement;
  sidebar: () => React.ReactElement;
  category?: 'main' | 'tools' | 'settings';
}

export const routes: RouteConfig[] = [
  // Main Navigation
  {
    path: "/app/dashboard",
    label: "Dashboard",
    icon: Home,
    category: 'main',
    main: () => React.createElement('div', null, 'Dashboard Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Dashboard'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Your personal dashboard with overview of all activities, quick actions, and recent updates.'
      )
    )
  },
  {
    path: "/app/notes",
    label: "Notes",
    icon: FileText,
    category: 'main',
    main: () => React.createElement('div', null, 'Notes Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Notes'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Create, organize, and manage your notes. Support for rich text editing and collaboration.'
      )
    )
  },
  {
    path: "/app/editor",
    label: "Editor",
    icon: Edit3,
    category: 'main',
    main: () => React.createElement('div', null, 'Editor Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Editor'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Advanced text editor with formatting tools, templates, and real-time collaboration features.'
      )
    )
  },
  {
    path: "/app/explorer",
    label: "Explorer",
    icon: Search,
    category: 'main',
    main: () => React.createElement('div', null, 'Explorer Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Explorer'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Browse and search through your content. Find notes, files, and projects with powerful filters.'
      )
    )
  },
  {
    path: "/app/files",
    label: "Files",
    icon: FolderOpen,
    category: 'main',
    main: () => React.createElement('div', null, 'Files Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Files'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Manage your files and documents. Upload, organize, and share files with secure access controls.'
      )
    )
  },
  {
    path: "/app/chat",
    label: "Chat",
    icon: MessageSquare,
    category: 'main',
    main: () => React.createElement('div', null, 'Chat Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Chat'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'AI-powered chat interface for assistance, brainstorming, and getting instant answers.'
      )
    )
  },
  {
    path: "/app/voice-chat",
    label: "Voice Chat",
    icon: Mic,
    category: 'main',
    main: () => React.createElement('div', null, 'Voice Chat Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Voice Chat'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Voice-enabled AI conversations. Speak naturally and get intelligent responses.'
      )
    )
  },
  {
    path: "/app/calendar",
    label: "Calendar",
    icon: Calendar,
    category: 'main',
    main: () => React.createElement('div', null, 'Calendar Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Calendar'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Schedule and manage your events, meetings, and deadlines with integrated notifications.'
      )
    )
  },

  // Tools Section
  {
    path: "/app/analytics",
    label: "Analytics",
    icon: BarChart3,
    category: 'tools',
    main: () => React.createElement('div', null, 'Analytics Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Analytics'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Track your productivity, usage patterns, and performance metrics with detailed insights.'
      )
    )
  },
  {
    path: "/app/activity",
    label: "Activity",
    icon: Activity,
    category: 'tools',
    main: () => React.createElement('div', null, 'Activity Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Activity'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'View your recent activity, track changes, and monitor collaboration across all your projects.'
      )
    )
  },
  {
    path: "/app/themes",
    label: "Themes",
    icon: Palette,
    category: 'tools',
    main: () => React.createElement('div', null, 'Themes Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Themes'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Customize your workspace appearance with beautiful themes and color schemes.'
      )
    )
  },
  {
    path: "/app/components",
    label: "Components",
    icon: Component,
    category: 'tools',
    main: () => React.createElement('div', null, 'Components Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Components'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Browse and use pre-built components to enhance your content and workflows.'
      )
    )
  },
  {
    path: "/app/ai-features",
    label: "AI Features",
    icon: Bot,
    category: 'tools',
    main: () => React.createElement('div', null, 'AI Features Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'AI Features'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Explore advanced AI capabilities including text generation, image analysis, and automation.'
      )
    )
   },
   {
     path: "/app/completion",
     label: "App Completion",
     icon: CheckCircle2,
     category: 'tools',
     main: () => React.createElement('div', null, 'App Completion Content'),
     sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
       React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'App Completion'),
       React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
         'Track development progress, run health checks, and monitor application completion metrics.'
       )
     )
   },

  // Settings Section
  {
    path: "/app/settings",
    label: "Settings",
    icon: Settings,
    category: 'settings',
    main: () => React.createElement('div', null, 'Settings Content'),
    sidebar: () => React.createElement('div', { className: 'space-y-3' }, 
      React.createElement('h3', { className: 'text-sm font-medium text-muted-foreground' }, 'Settings'),
      React.createElement('p', { className: 'text-sm text-muted-foreground/80 leading-relaxed' }, 
        'Configure your preferences, account settings, integrations, and privacy options.'
      )
    )
  }
];