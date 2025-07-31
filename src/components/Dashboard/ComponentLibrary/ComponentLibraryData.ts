import React from 'react';
import { 
  Grid3X3,
  BarChart3,
  Users,
  Activity,
  Calendar,
  FileText,
  Zap,
  Share2,
  Folder,
  TrendingUp,
  Calculator,
  LineChart,
  PieChart,
  Upload,
  Search,
  Timer,
  ArrowRightLeft
} from 'lucide-react';

export interface ComponentLibraryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  componentKey: string;
  tags: string[];
  preview?: React.ComponentType;
  createdAt: string; // ISO date string
  isNew?: boolean; // Auto-calculated based on createdAt
}

export const componentLibraryItems: ComponentLibraryItem[] = [
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Common actions and shortcuts for quick access',
    category: 'Actions',
    icon: Grid3X3,
    componentKey: 'quick-actions',
    tags: ['actions', 'shortcuts', 'productivity'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'analytics-overview',
    name: 'Analytics Overview',
    description: 'Key metrics and performance indicators',
    category: 'Analytics',
    icon: BarChart3,
    componentKey: 'analytics-overview',
    tags: ['analytics', 'metrics', 'kpi'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'recent-activity',
    name: 'Recent Activity',
    description: 'Latest actions and user activity feed',
    category: 'Activity',
    icon: Activity,
    componentKey: 'recent-activity',
    tags: ['activity', 'feed', 'updates'],
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'calendar-widget',
    name: 'Calendar',
    description: 'Calendar view with events and scheduling',
    category: 'Time',
    icon: Calendar,
    componentKey: 'calendar-widget',
    tags: ['calendar', 'events', 'schedule'],
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'notes-summary',
    name: 'Notes Summary',
    description: 'Overview of notes and documents',
    category: 'Content',
    icon: FileText,
    componentKey: 'notes-summary',
    tags: ['notes', 'documents', 'content'],
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'system-status',
    name: 'System Status',
    description: 'System health and performance monitoring',
    category: 'System',
    icon: Zap,
    componentKey: 'system-status',
    tags: ['system', 'status', 'monitoring'],
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Task management and to-do lists',
    category: 'Productivity',
    icon: Users,
    componentKey: 'task-list',
    tags: ['tasks', 'todo', 'productivity'],
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 'stats-revenue',
    name: 'Revenue Stats',
    description: 'Revenue tracking and financial metrics',
    category: 'Analytics',
    icon: TrendingUp,
    componentKey: 'stats-revenue',
    tags: ['revenue', 'finance', 'stats'],
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'stats-users',
    name: 'User Stats',
    description: 'User analytics and engagement metrics',
    category: 'Analytics',
    icon: Users,
    componentKey: 'stats-users',
    tags: ['users', 'engagement', 'stats'],
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'social-twitter',
    name: 'Social Media',
    description: 'Social media analytics and posts',
    category: 'Social',
    icon: Share2,
    componentKey: 'social-twitter',
    tags: ['social', 'twitter', 'engagement'],
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'project-active',
    name: 'Active Projects',
    description: 'Current project status and progress',
    category: 'Projects',
    icon: Folder,
    componentKey: 'project-active',
    tags: ['projects', 'progress', 'team'],
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'simple-calculator',
    name: 'Simple Calculator',
    description: 'Basic calculator with colorful number effects',
    category: 'Tools',
    icon: Calculator,
    componentKey: 'simple-calculator',
    tags: ['calculator', 'math', 'tools', 'numbers'],
    createdAt: '2024-04-01T10:00:00Z'
  },
  // Chart Widgets - NEW
  {
    id: 'line-chart',
    name: 'Line Chart',
    description: 'Display trends and data over time with line visualization',
    category: 'Charts',
    icon: LineChart,
    componentKey: 'line-chart',
    tags: ['chart', 'line', 'trends', 'data', 'visualization'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    description: 'Show data distribution with circular pie chart',
    category: 'Charts',
    icon: PieChart,
    componentKey: 'pie-chart',
    tags: ['chart', 'pie', 'distribution', 'circular', 'percentage'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    description: 'Visualize data trends with filled area under the curve',
    category: 'Charts',
    icon: Activity,
    componentKey: 'area-chart',
    tags: ['chart', 'area', 'trends', 'filled', 'volume'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  // Utility Widgets - NEW
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Drag and drop file upload with progress tracking',
    category: 'Utilities',
    icon: Upload,
    componentKey: 'file-upload',
    tags: ['upload', 'files', 'drag', 'drop', 'storage'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'search-filter',
    name: 'Search & Filter',
    description: 'Advanced search and filtering interface for data',
    category: 'Utilities',
    icon: Search,
    componentKey: 'search-filter',
    tags: ['search', 'filter', 'data', 'interface', 'query'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'timer-stopwatch',
    name: 'Stopwatch',
    description: 'Precision stopwatch for timing activities',
    category: 'Utilities',
    icon: Timer,
    componentKey: 'timer-stopwatch',
    tags: ['timer', 'stopwatch', 'time', 'measure', 'precision'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'timer-countdown',
    name: 'Countdown Timer',
    description: 'Set countdown timers with visual progress',
    category: 'Utilities',
    icon: Timer,
    componentKey: 'timer-countdown',
    tags: ['timer', 'countdown', 'alarm', 'reminder', 'progress'],
    createdAt: '2025-01-16T10:00:00Z'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'Utilities',
    icon: ArrowRightLeft,
    componentKey: 'unit-converter',
    tags: ['converter', 'units', 'measurement', 'calculator', 'tools'],
    createdAt: '2025-01-16T10:00:00Z'
  }
];

// Helper function to determine if a component is "new" (created within last 30 days)
export const isComponentNew = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return created > thirtyDaysAgo;
};

// Auto-calculate isNew for all components
export const processedComponentLibraryItems = componentLibraryItems.map(component => ({
  ...component,
  isNew: isComponentNew(component.createdAt)
}));

export const categories = ['All', 'New', 'Analytics', 'Actions', 'Activity', 'Time', 'Content', 'System', 'Productivity', 'Social', 'Projects', 'Tools', 'Charts', 'Utilities'];