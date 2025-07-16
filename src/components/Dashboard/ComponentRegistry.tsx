import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our standalone dashboard components
import { QuickActions } from '@/components/Dashboard/Components/QuickActions';
import { RecentActivity } from '@/components/Dashboard/Components/RecentActivity';
import { AnalyticsOverview } from '@/components/Dashboard/Components/AnalyticsOverview';
import { CalendarWidget } from '@/components/Dashboard/Components/CalendarWidget';
import { SystemStatus } from '@/components/Dashboard/Components/SystemStatus';
import { NotesSummary } from '@/components/Dashboard/Components/NotesSummary';
import { TaskList } from '@/components/Dashboard/Components/TaskList';
import { WeatherWidget } from '@/components/Dashboard/Components/WeatherWidget';
import { StatsCard } from '@/components/Dashboard/Components/StatsCard';
import { SocialMediaCard } from '@/components/Dashboard/Components/SocialMediaCard';
import { ProjectCard } from '@/components/Dashboard/Components/ProjectCard';
import { PerformanceCard } from '@/components/Dashboard/Components/PerformanceCard';
import { SimpleCalculator } from '@/components/Calculator/SimpleCalculator';

// Import new chart and utility widgets
import { LineChart } from './widgets/ChartWidgets/LineChart';
import { PieChart } from './widgets/ChartWidgets/PieChart';
import { AreaChart } from './widgets/ChartWidgets/AreaChart';
import { FileUploadWidget } from './widgets/FileUploadWidget';
import { SearchFilterWidget } from './widgets/SearchFilterWidget';
import { TimerWidget } from './widgets/TimerWidget';
import { UnitConverterWidget } from './widgets/UnitConverterWidget';

// Using our standalone components - no need for wrapper components

// Component registry using our standalone components
const componentRegistry: Record<string, React.ComponentType> = {
  'recent-activity': RecentActivity,
  'quick-actions': QuickActions,
  'analytics-overview': AnalyticsOverview,
  'system-status': SystemStatus,
  'notes-summary': NotesSummary,
  'calendar-widget': CalendarWidget,
  'weather-widget': WeatherWidget,
  'task-list': TaskList,
  // New component cards
  'stats-revenue': () => <StatsCard variant="revenue" />,
  'stats-users': () => <StatsCard variant="users" />,
  'stats-views': () => <StatsCard variant="views" />,
  'stats-growth': () => <StatsCard variant="growth" />,
  'social-twitter': () => <SocialMediaCard variant="twitter" />,
  'social-instagram': () => <SocialMediaCard variant="instagram" />,
  'social-linkedin': () => <SocialMediaCard variant="linkedin" />,
  'project-active': () => <ProjectCard variant="active" />,
  'project-completed': () => <ProjectCard variant="completed" />,
  'project-overdue': () => <ProjectCard variant="overdue" />,
  'performance-cpu': () => <PerformanceCard variant="cpu" />,
  'performance-memory': () => <PerformanceCard variant="memory" />,
  'performance-network': () => <PerformanceCard variant="network" />,
  'performance-storage': () => <PerformanceCard variant="storage" />,
  'simple-calculator': SimpleCalculator,
  // Chart widgets
  'line-chart': LineChart,
  'pie-chart': PieChart,
  'area-chart': AreaChart,
  // Utility widgets  
  'file-upload': FileUploadWidget,
  'search-filter': SearchFilterWidget,
  'timer-stopwatch': () => <TimerWidget mode="stopwatch" />,
  'timer-countdown': () => <TimerWidget mode="timer" />,
  'unit-converter': UnitConverterWidget,
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