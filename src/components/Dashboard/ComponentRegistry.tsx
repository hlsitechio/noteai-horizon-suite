import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Zap, 
  BarChart3, 
  Monitor, 
  FileText, 
  Calendar,
  Cloud,
  CheckSquare,
  TrendingUp,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import KPIStats from '@/components/Dashboard/KPIStats';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';

// Component definitions
const RecentActivityComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Note created</span>
          <span className="text-xs text-muted-foreground">2 min ago</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Dashboard updated</span>
          <span className="text-xs text-muted-foreground">5 min ago</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Settings changed</span>
          <span className="text-xs text-muted-foreground">1 hour ago</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionsComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <Button variant="outline" size="sm" className="justify-start">
          <FileText className="h-4 w-4 mr-2" />
          New Note
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Event
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Users className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsOverviewComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Analytics Overview
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total Views</span>
          <Badge variant="secondary">1,234</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Active Users</span>
          <Badge variant="secondary">89</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Conversion Rate</span>
          <Badge variant="secondary">4.2%</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SystemStatusComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        System Status
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">API Status</span>
          <Badge variant="default" className="bg-green-500">Online</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Database</span>
          <Badge variant="default" className="bg-green-500">Healthy</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Storage</span>
          <Badge variant="secondary">85% Used</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NotesSummaryComponent: React.FC = () => {
  const { notes } = useOptimizedNotes();
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Notes</span>
            <Badge variant="secondary">{notes.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Favorites</span>
            <Badge variant="secondary">
              {notes.filter(n => n.tags?.includes('favorite')).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">This Week</span>
            <Badge variant="secondary">
              {notes.filter(n => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(n.createdAt) > weekAgo;
              }).length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarWidgetComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Calendar
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-center">
        <div className="text-2xl font-bold">{new Date().getDate()}</div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Upcoming</div>
        <div className="text-sm">Team Meeting - 2:00 PM</div>
        <div className="text-sm">Project Review - 4:30 PM</div>
      </div>
    </CardContent>
  </Card>
);

const WeatherWidgetComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Cloud className="h-4 w-4" />
        Weather
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-center">
        <div className="text-2xl font-bold">22°C</div>
        <div className="text-sm text-muted-foreground">Partly Cloudy</div>
      </div>
      <div className="flex justify-between text-xs">
        <span>High: 25°C</span>
        <span>Low: 18°C</span>
      </div>
    </CardContent>
  </Card>
);

const TaskListComponent: React.FC = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4" />
        Tasks
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Review dashboard settings</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm">Update project documentation</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded" defaultChecked />
          <span className="text-sm line-through text-muted-foreground">Setup dashboard layout</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Component registry
const componentRegistry: Record<string, React.ComponentType> = {
  'recent-activity': RecentActivityComponent,
  'quick-actions': QuickActionsComponent,
  'analytics-overview': AnalyticsOverviewComponent,
  'system-status': SystemStatusComponent,
  'notes-summary': NotesSummaryComponent,
  'calendar-widget': CalendarWidgetComponent,
  'weather-widget': WeatherWidgetComponent,
  'task-list': TaskListComponent,
};

// Default fallback component
const DefaultComponent: React.FC<{ componentKey: string }> = ({ componentKey }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Component Not Found
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Component "{componentKey}" is not available.
      </p>
    </CardContent>
  </Card>
);

// Main component renderer
interface DashboardComponentRendererProps {
  componentKey: string;
  props?: Record<string, any>;
}

export const DashboardComponentRenderer: React.FC<DashboardComponentRendererProps> = ({ 
  componentKey, 
  props = {} 
}) => {
  const Component = componentRegistry[componentKey];
  
  if (!Component) {
    return <DefaultComponent componentKey={componentKey} />;
  }
  
  return <Component {...props} />;
};

export default DashboardComponentRenderer;