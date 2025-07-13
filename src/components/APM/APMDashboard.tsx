import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAPMMonitoring } from '@/hooks/useAPMMonitoring';
import { apmService } from '@/services/apmService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Bug,
  Filter,
  Eye,
  EyeOff,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Zap
} from 'lucide-react';

interface APMMetric {
  id: string;
  metric_name: string;
  metric_type: string;
  metric_value: number;
  timestamp: string;
}

interface APMError {
  id: string;
  error_type: string;
  error_message: string;
  component_name?: string;
  is_filtered?: boolean;
  timestamp: string;
}

interface APMAlert {
  id: string;
  title: string;
  description: string;
  severity: string;
  is_acknowledged: boolean;
  is_resolved: boolean;
  created_at: string;
}

interface APMDashboardProps {
  className?: string;
}

export const APMDashboard: React.FC<APMDashboardProps> = ({ className }) => {
  const {
    isEnabled,
    filterLevel,
    stats,
    enableFiltering,
    setConsoleFilterLevel,
    suppressNextError
  } = useAPMMonitoring();

  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [metrics, setMetrics] = useState<APMMetric[]>([]);
  const [errors, setErrors] = useState<APMError[]>([]);
  const [alerts, setAlerts] = useState<APMAlert[]>([]);
  const [includeFiltered, setIncludeFiltered] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, errorsData, alertsData] = await Promise.all([
          apmService.getMetrics(timeRange),
          apmService.getErrors(timeRange, includeFiltered),
          apmService.getAlerts()
        ]);

        setMetrics(metricsData);
        setErrors(errorsData);
        setAlerts(alertsData);
      } catch (error) {
        // TODO: Implement proper error logging service
        if (import.meta.env.DEV) {
          console.error('Failed to load APM data:', error);
        }
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [timeRange, includeFiltered]);

  // Process data for charts
  const performanceData = metrics
    .filter(m => m.metric_type === 'performance')
    .reduce((acc, metric) => {
      const hour = new Date(metric.timestamp).getHours();
      const existing = acc.find(item => item.hour === hour);
      if (existing) {
        existing.value = (existing.value + metric.metric_value) / 2;
      } else {
        acc.push({ hour, value: metric.metric_value });
      }
      return acc;
    }, [] as Array<{ hour: number; value: number }>);

  const errorsByType = errors.reduce((acc, error) => {
    const type = error.error_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const errorTypeData = Object.entries(errorsByType).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--primary))', 'hsl(var(--secondary))'];

  const handleAcknowledgeAlert = async (alertId: string) => {
    await apmService.acknowledgeAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, is_acknowledged: true } : alert
    ));
  };

  const handleResolveAlert = async (alertId: string) => {
    await apmService.resolveAlert(alertId);
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, is_resolved: true, is_acknowledged: true } : alert
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Application Performance Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor your application's performance and filter development noise
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as '1h' | '24h' | '7d' | '30d')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            APM Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Enable APM Monitoring</div>
              <div className="text-sm text-muted-foreground">
                Track performance metrics and errors
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={enableFiltering}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Console Filter Level</div>
              <div className="text-sm text-muted-foreground">
                Filter development environment noise
              </div>
            </div>
            <Select value={filterLevel} onValueChange={(value) => setConsoleFilterLevel(value as 'none' | 'dev' | 'strict')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Filter</SelectItem>
                <SelectItem value="dev">Dev Filter</SelectItem>
                <SelectItem value="strict">Strict Filter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">Include Filtered Errors</div>
              <div className="text-sm text-muted-foreground">
                Show development errors in reports
              </div>
            </div>
            <Switch
              checked={includeFiltered}
              onCheckedChange={setIncludeFiltered}
            />
          </div>

          <Button onClick={suppressNextError} variant="outline" size="sm">
            <EyeOff className="h-4 w-4 mr-2" />
            Suppress Next Error
          </Button>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">{stats.totalErrors}</div>
                <div className="text-sm text-muted-foreground">Total Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">{stats.filteredErrors}</div>
                <div className="text-sm text-muted-foreground">Filtered Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{Math.round(stats.avgResponseTime)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">{stats.alertCount}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Application performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={errorTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {errorTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={error.id || `error-${index}`} className="p-3 border rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant={error.is_filtered ? "secondary" : "destructive"}>
                          {error.error_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm">{error.error_message}</div>
                      {error.component_name && (
                        <div className="text-xs text-muted-foreground">
                          Component: {error.component_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Performance and error alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(alert => !alert.is_resolved).map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                        <span className="font-medium">{alert.title}</span>
                      </div>
                      <div className="flex gap-2">
                        {!alert.is_acknowledged && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                {alerts.filter(alert => !alert.is_resolved).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active alerts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};