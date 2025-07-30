import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const systemMetrics = [
  {
    id: 'cpu',
    label: 'CPU Usage',
    value: 45,
    max: 100,
    unit: '%',
    status: 'good',
    icon: Cpu
  },
  {
    id: 'memory',
    label: 'Memory',
    value: 68,
    max: 100,
    unit: '%',
    status: 'warning',
    icon: HardDrive
  },
  {
    id: 'storage',
    label: 'Storage',
    value: 23,
    max: 100,
    unit: '%',
    status: 'good',
    icon: Database
  }
];

const services = [
  {
    id: 'api',
    name: 'API Service',
    status: 'online',
    uptime: '99.9%',
    responseTime: '45ms'
  },
  {
    id: 'database',
    name: 'Database',
    status: 'online',
    uptime: '99.8%',
    responseTime: '12ms'
  },
  {
    id: 'storage',
    name: 'File Storage',
    status: 'maintenance',
    uptime: '99.5%',
    responseTime: '150ms'
  },
  {
    id: 'auth',
    name: 'Authentication',
    status: 'online',
    uptime: '100%',
    responseTime: '8ms'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    case 'maintenance':
      return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    case 'offline':
      return <XCircle className="h-3 w-3 text-red-500" />;
    default:
      return <Monitor className="h-3 w-3 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

export function SystemStatus() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">System Status</CardTitle>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              All Systems
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Metrics */}
        <div className="space-y-3">
          {systemMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-1.5"
                />
              </div>
            );
          })}
        </div>

        {/* Services Status */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Services</span>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Secure</span>
            </div>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(service.status)}
                  <span className="text-xs font-medium text-foreground">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{service.uptime}</span>
                  <span>•</span>
                  <span>{service.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs text-green-600">
                Connected
              </Badge>
              <span className="text-xs text-muted-foreground">125ms</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            <Monitor className="h-3 w-3 mr-1" />
            View Detailed Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}