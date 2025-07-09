import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Plus, 
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
import { ComponentPreview } from './ComponentPreview';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { toast } from 'sonner';

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

const componentLibraryItems: ComponentLibraryItem[] = [
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

const categories = ['All', 'Analytics', 'Actions', 'Activity', 'Time', 'Content', 'System', 'Productivity', 'Info', 'Social', 'Projects'];

interface ComponentLibraryProps {
  onAddComponent?: (componentKey: string, panelKey: string) => void;
  availablePanels?: string[];
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ 
  onAddComponent,
  availablePanels = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComponent, setSelectedComponent] = useState<ComponentLibraryItem | null>(null);
  const { updatePanelConfiguration } = useDashboardLayout();

  const filteredComponents = componentLibraryItems.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToPanel = async (componentKey: string, panelKey: string) => {
    try {
      await updatePanelConfiguration(panelKey, componentKey, true);
      toast.success(`Component added to ${panelKey} panel`);
      
      if (onAddComponent) {
        onAddComponent(componentKey, panelKey);
      }
    } catch (error) {
      console.error('Failed to add component:', error);
      toast.error('Failed to add component to panel');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Component Library</h2>
          <p className="text-muted-foreground">
            Browse and add components to your dashboard panels
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComponents.map((component) => {
          const Icon = component.icon;
          
          return (
            <Card key={component.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{component.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {component.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {component.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedComponent(component)}
                      >
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Icon className="h-5 w-5" />
                          <span>{component.name}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <ComponentPreview 
                        componentKey={component.componentKey}
                        description={component.description}
                        onAddToPanel={(panelKey) => handleAddToPanel(component.componentKey, panelKey)}
                        availablePanels={availablePanels}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center space-x-1">
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Component to Panel</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Select a panel to add the "{component.name}" component:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {availablePanels.map((panelKey) => (
                            <Button
                              key={panelKey}
                              variant="outline"
                              onClick={() => handleAddToPanel(component.componentKey, panelKey)}
                              className="justify-start"
                            >
                              {panelKey.replace(/([A-Z])/g, ' $1').trim()}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No components found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};