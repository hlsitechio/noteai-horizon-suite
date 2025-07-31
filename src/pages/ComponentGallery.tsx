import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Calendar, 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Monitor, 
  Cloud, 
  Zap 
} from 'lucide-react';

// Import dashboard components
import { QuickActions } from '@/components/Dashboard/Components/QuickActions';
import { RecentActivity } from '@/components/Dashboard/Components/RecentActivity';
import { AnalyticsOverview } from '@/components/Dashboard/Components/AnalyticsOverview';
import { CalendarWidget } from '@/components/Dashboard/Components/CalendarWidget';
import { NotesSummary } from '@/components/Dashboard/Components/NotesSummary';
import { TaskList } from '@/components/Dashboard/Components/TaskList';
import { SystemStatus } from '@/components/Dashboard/Components/SystemStatus';
import { WeatherWidget } from '@/components/Dashboard/Components/WeatherWidget';

const componentDefinitions = [
  {
    id: 'actions',
    name: 'Quick Actions',
    description: 'Quick action buttons for common tasks',
    icon: Zap,
    category: 'actions',
    component: QuickActions,
  },
  {
    id: 'activity',
    name: 'Recent Activity',
    description: 'Shows recent user activities and updates',
    icon: Activity,
    category: 'activity',
    component: RecentActivity,
  },
  {
    id: 'analytics',
    name: 'Analytics Overview',
    description: 'Analytics and metrics overview',
    icon: BarChart3,
    category: 'analytics',
    component: AnalyticsOverview,
  },
  {
    id: 'calendar',
    name: 'Calendar Widget',
    description: 'Mini calendar with upcoming events',
    icon: Calendar,
    category: 'calendar',
    component: CalendarWidget,
  },
  {
    id: 'content',
    name: 'Notes Summary',
    description: 'Summary of notes and documents',
    icon: FileText,
    category: 'content',
    component: NotesSummary,
  },
  {
    id: 'productivity',
    name: 'Task List',
    description: 'Personal task and todo management',
    icon: CheckSquare,
    category: 'productivity',
    component: TaskList,
  },
  {
    id: 'system',
    name: 'System Status',
    description: 'System health and status indicators',
    icon: Monitor,
    category: 'system',
    component: SystemStatus,
  },
  {
    id: 'widgets',
    name: 'Weather Widget',
    description: 'Current weather information',
    icon: Cloud,
    category: 'widgets',
    component: WeatherWidget,
  },
];

const categories = [
  { id: 'all', name: 'All Components' },
  { id: 'actions', name: 'Actions' },
  { id: 'activity', name: 'Activity' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'content', name: 'Content' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'system', name: 'System' },
  { id: 'widgets', name: 'Widgets' },
];

export default function ComponentGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewComponent, setPreviewComponent] = useState<string | null>(null);

  const filteredComponents = componentDefinitions.filter(
    component => selectedCategory === 'all' || component.category === selectedCategory
  );

  const PreviewComponent = previewComponent 
    ? componentDefinitions.find(c => c.id === previewComponent)?.component 
    : null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Component Gallery</h1>
          <p className="text-muted-foreground">
            Explore and preview dashboard components that can be added to your layout
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 lg:grid-cols-9 w-full">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Components List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Available Components</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredComponents.map((component) => {
                  const IconComponent = component.icon;
                  return (
                    <Card 
                      key={component.id} 
                      className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                        previewComponent === component.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setPreviewComponent(component.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-foreground">{component.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {component.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {component.description}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewComponent(component.id);
                            }}
                          >
                            Preview Component
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Component Preview</h2>
              <Card className="p-6 min-h-[400px]">
                {PreviewComponent ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">
                        {componentDefinitions.find(c => c.id === previewComponent)?.name}
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPreviewComponent(null)}
                      >
                        Close Preview
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <PreviewComponent />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Monitor className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-foreground">No Component Selected</h3>
                        <p className="text-muted-foreground">
                          Click on a component from the list to see its preview
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}