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
  TrendingUp
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
}

export const componentLibraryItems: ComponentLibraryItem[] = [
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Common actions and shortcuts for quick access',
    category: 'Actions',
    icon: Grid3X3,
    componentKey: 'quick-actions',
    tags: ['actions', 'shortcuts', 'productivity']
  },
  {
    id: 'analytics-overview',
    name: 'Analytics Overview',
    description: 'Key metrics and performance indicators',
    category: 'Analytics',
    icon: BarChart3,
    componentKey: 'analytics-overview',
    tags: ['analytics', 'metrics', 'kpi']
  },
  {
    id: 'recent-activity',
    name: 'Recent Activity',
    description: 'Latest actions and user activity feed',
    category: 'Activity',
    icon: Activity,
    componentKey: 'recent-activity',
    tags: ['activity', 'feed', 'updates']
  },
  {
    id: 'calendar-widget',
    name: 'Calendar',
    description: 'Calendar view with events and scheduling',
    category: 'Time',
    icon: Calendar,
    componentKey: 'calendar-widget',
    tags: ['calendar', 'events', 'schedule']
  },
  {
    id: 'notes-summary',
    name: 'Notes Summary',
    description: 'Overview of notes and documents',
    category: 'Content',
    icon: FileText,
    componentKey: 'notes-summary',
    tags: ['notes', 'documents', 'content']
  },
  {
    id: 'system-status',
    name: 'System Status',
    description: 'System health and performance monitoring',
    category: 'System',
    icon: Zap,
    componentKey: 'system-status',
    tags: ['system', 'status', 'monitoring']
  },
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Task management and to-do lists',
    category: 'Productivity',
    icon: Users,
    componentKey: 'task-list',
    tags: ['tasks', 'todo', 'productivity']
  },
  {
    id: 'weather-widget',
    name: 'Weather',
    description: 'Current weather conditions and forecast',
    category: 'Info',
    icon: Share2,
    componentKey: 'weather-widget',
    tags: ['weather', 'forecast', 'location']
  },
  {
    id: 'stats-revenue',
    name: 'Revenue Stats',
    description: 'Revenue tracking and financial metrics',
    category: 'Analytics',
    icon: TrendingUp,
    componentKey: 'stats-revenue',
    tags: ['revenue', 'finance', 'stats']
  },
  {
    id: 'stats-users',
    name: 'User Stats',
    description: 'User analytics and engagement metrics',
    category: 'Analytics',
    icon: Users,
    componentKey: 'stats-users',
    tags: ['users', 'engagement', 'stats']
  },
  {
    id: 'social-twitter',
    name: 'Social Media',
    description: 'Social media analytics and posts',
    category: 'Social',
    icon: Share2,
    componentKey: 'social-twitter',
    tags: ['social', 'twitter', 'engagement']
  },
  {
    id: 'project-active',
    name: 'Active Projects',
    description: 'Current project status and progress',
    category: 'Projects',
    icon: Folder,
    componentKey: 'project-active',
    tags: ['projects', 'progress', 'team']
  }
];

export const categories = ['All', 'Analytics', 'Actions', 'Activity', 'Time', 'Content', 'System', 'Productivity', 'Info', 'Social', 'Projects'];