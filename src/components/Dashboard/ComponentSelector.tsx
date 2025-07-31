import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, Calendar, FileText, Clock, Target, 
  Activity, Users, TrendingUp, Star, Folder,
  MessageSquare, Bell, Zap, Brain, Settings
} from 'lucide-react';

interface DashboardComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'productivity' | 'analytics' | 'content' | 'collaboration';
  recommended?: boolean;
}

const AVAILABLE_COMPONENTS: DashboardComponent[] = [
  {
    id: 'notes-summary',
    name: 'Notes Summary',
    description: 'Quick overview of your notes, folders, and recent activity',
    icon: FileText,
    category: 'content',
    recommended: true
  },
  {
    id: 'analytics-overview',
    name: 'Analytics Overview',
    description: 'Writing stats, time spent, and productivity metrics',
    icon: BarChart3,
    category: 'analytics',
    recommended: true
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Fast access to create notes, upload files, and more',
    icon: Zap,
    category: 'productivity',
    recommended: true
  },
  {
    id: 'recent-activity',
    name: 'Recent Activity',
    description: 'Timeline of your latest actions and updates',
    icon: Activity,
    category: 'content'
  },
  {
    id: 'calendar-widget',
    name: 'Calendar & Schedule',
    description: 'View upcoming events and deadlines',
    icon: Calendar,
    category: 'productivity'
  },
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Manage your to-dos and track progress',
    icon: Target,
    category: 'productivity'
  },
  {
    id: 'ai-assistant',
    name: 'AI Writing Assistant',
    description: 'Get smart suggestions and writing help',
    icon: Brain,
    category: 'productivity'
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    description: 'Shared notes and team activity',
    icon: Users,
    category: 'collaboration'
  },
  {
    id: 'favorites',
    name: 'Favorite Notes',
    description: 'Quick access to your starred content',
    icon: Star,
    category: 'content'
  },
  {
    id: 'folder-navigator',
    name: 'Folder Navigator',
    description: 'Browse and organize your folder structure',
    icon: Folder,
    category: 'content'
  },
  {
    id: 'notifications',
    name: 'Notifications Center',
    description: 'Stay updated with alerts and reminders',
    icon: Bell,
    category: 'productivity'
  },
  {
    id: 'system-status',
    name: 'System Status',
    description: 'Monitor app performance and health',
    icon: Settings,
    category: 'analytics'
  }
];

const CATEGORIES = [
  { id: 'productivity', name: 'Productivity', color: 'bg-blue-500' },
  { id: 'analytics', name: 'Analytics', color: 'bg-green-500' },
  { id: 'content', name: 'Content', color: 'bg-purple-500' },
  { id: 'collaboration', name: 'Collaboration', color: 'bg-orange-500' }
];

interface ComponentSelectorProps {
  onComponentsSelected: (selectedComponents: string[]) => void;
  onSkip: () => void;
  className?: string;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  onComponentsSelected,
  onSkip,
  className
}) => {
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    AVAILABLE_COMPONENTS.filter(c => c.recommended).map(c => c.id)
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredComponents = selectedCategory 
    ? AVAILABLE_COMPONENTS.filter(c => c.category === selectedCategory)
    : AVAILABLE_COMPONENTS;

  const handleComponentToggle = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const handleSelectAll = () => {
    const currentComponents = filteredComponents.map(c => c.id);
    const allSelected = currentComponents.every(id => selectedComponents.includes(id));
    
    if (allSelected) {
      setSelectedComponents(prev => prev.filter(id => !currentComponents.includes(id)));
    } else {
      setSelectedComponents(prev => [...new Set([...prev, ...currentComponents])]);
    }
  };

  const handleSelectRecommended = () => {
    const recommended = AVAILABLE_COMPONENTS.filter(c => c.recommended).map(c => c.id);
    setSelectedComponents(recommended);
  };

  const handleFinish = () => {
    onComponentsSelected(selectedComponents);
  };

  return (
    <div className={`max-w-5xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <Card className="text-center border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Customize Your Dashboard 🎛️
          </CardTitle>
          <CardDescription className="text-lg">
            Choose the components that matter most to your workflow. You can always add or remove them later.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Components
        </Button>
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${category.color}`} />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={handleSelectRecommended}>
          Select Recommended
        </Button>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {filteredComponents.every(c => selectedComponents.includes(c.id)) ? 'Deselect All' : 'Select All'}
        </Button>
        <Badge variant="secondary" className="px-3 py-1">
          {selectedComponents.length} selected
        </Badge>
      </div>

      {/* Components Grid */}
      <ScrollArea className="h-[400px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
          {filteredComponents.map((component) => {
            const Icon = component.icon;
            const isSelected = selectedComponents.includes(component.id);
            const category = CATEGORIES.find(c => c.id === component.category);
            
            return (
              <Card 
                key={component.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleComponentToggle(component.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary/20' : 'bg-muted'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          {component.name}
                          {component.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">
                    {component.description}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${category?.color} mr-1`} />
                      {category?.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={onSkip}
          className="px-8"
        >
          Skip for Now
        </Button>
        <Button 
          onClick={handleFinish}
          disabled={selectedComponents.length === 0}
          className="px-8"
        >
          Add {selectedComponents.length} Component{selectedComponents.length !== 1 ? 's' : ''} to Dashboard
        </Button>
      </div>
    </div>
  );
};