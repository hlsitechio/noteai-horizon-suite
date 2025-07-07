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
import { useIsMobile } from '@/hooks/use-mobile';

// Component definitions
const RecentActivityComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <Activity className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Note created</span>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>2 min ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Dashboard updated</span>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>5 min ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Settings changed</span>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>1 hour ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActionsComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <Zap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0' : ''}`}>
        <div className={`grid grid-cols-1 gap-2`}>
          <Button variant="outline" size={isMobile ? "sm" : "sm"} className="justify-start">
            <FileText className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>New Note</span>
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "sm"} className="justify-start">
            <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>Schedule Event</span>
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "sm"} className="justify-start">
            <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>Invite User</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsOverviewComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <BarChart3 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 ${isMobile ? 'p-3 pt-0 space-y-2' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Total Views</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>1,234</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Active Users</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>89</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Conversion Rate</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>4.2%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemStatusComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <Monitor className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0 space-y-2' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>API Status</span>
            <Badge variant="default" className={`bg-green-500 ${isMobile ? 'text-xs' : ''}`}>Online</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Database</span>
            <Badge variant="default" className={`bg-green-500 ${isMobile ? 'text-xs' : ''}`}>Healthy</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Storage</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>85% Used</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotesSummaryComponent: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <FileText className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Notes Summary
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0 space-y-2' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Total Notes</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>{notes.length}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Favorites</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>
              {notes.filter(n => n.tags?.includes('favorite')).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>This Week</span>
            <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>
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

const CalendarWidgetComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0 space-y-2' : ''}`}>
        <div className="text-center">
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{new Date().getDate()}</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="space-y-1">
          <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>Upcoming</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Team Meeting - 2:00 PM</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Project Review - 4:30 PM</div>
        </div>
      </CardContent>
    </Card>
  );
};

const WeatherWidgetComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <Cloud className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-3 ${isMobile ? 'p-3 pt-0 space-y-2' : ''}`}>
        <div className="text-center">
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>22°C</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Partly Cloudy</div>
        </div>
        <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-xs'}`}>
          <span>High: 25°C</span>
          <span>Low: 18°C</span>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskListComponent: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <CheckSquare className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-2 ${isMobile ? 'p-3 pt-0' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Review dashboard settings</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Update project documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} line-through text-muted-foreground`}>Setup dashboard layout</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
const DefaultComponent: React.FC<{ componentKey: string }> = ({ componentKey }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="h-full">
      <CardHeader className={isMobile ? 'p-3 pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : ''}`}>
          <AlertCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          Component Not Found
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'p-3 pt-0' : ''}>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
          Component "{componentKey}" is not available.
        </p>
      </CardContent>
    </Card>
  );
};

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