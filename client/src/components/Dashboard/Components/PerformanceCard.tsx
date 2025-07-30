import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Cpu, 
  HardDrive, 
  Wifi, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PerformanceCardProps {
  variant?: 'cpu' | 'memory' | 'network' | 'storage';
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ variant = 'cpu' }) => {
  const performanceData = {
    cpu: {
      title: 'CPU Usage',
      value: 67,
      status: 'normal',
      icon: Cpu,
      unit: '%',
      trend: 'up',
      change: '+5%',
      details: [
        { label: 'Cores', value: '8' },
        { label: 'Frequency', value: '3.2 GHz' },
        { label: 'Temperature', value: '65°C' }
      ]
    },
    memory: {
      title: 'Memory Usage',
      value: 84,
      status: 'warning',
      icon: HardDrive,
      unit: '%',
      trend: 'up',
      change: '+12%',
      details: [
        { label: 'Used', value: '13.4 GB' },
        { label: 'Available', value: '2.6 GB' },
        { label: 'Total', value: '16 GB' }
      ]
    },
    network: {
      title: 'Network',
      value: 45,
      status: 'good',
      icon: Wifi,
      unit: 'Mbps',
      trend: 'down',
      change: '-3%',
      details: [
        { label: 'Download', value: '45 Mbps' },
        { label: 'Upload', value: '12 Mbps' },
        { label: 'Latency', value: '24ms' }
      ]
    },
    storage: {
      title: 'Storage',
      value: 72,
      status: 'normal',
      icon: HardDrive,
      unit: '%',
      trend: 'up',
      change: '+2%',
      details: [
        { label: 'Used', value: '720 GB' },
        { label: 'Free', value: '280 GB' },
        { label: 'Total', value: '1 TB' }
      ]
    }
  };

  const data = performanceData[variant];
  const Icon = data.icon;

  const getStatusColor = () => {
    switch (data.status) {
      case 'good':
        return 'text-emerald-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendIcon = () => {
    return data.trend === 'up' ? (
      <TrendingUp className="h-3 w-3 text-red-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-emerald-500" />
    );
  };

  const getProgressColor = () => {
    if (data.value > 85) return 'bg-red-500';
    if (data.value > 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${getStatusColor()}`} />
            <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metric */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {data.value}{data.unit}
            </span>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon()}
              <span className={data.trend === 'up' ? 'text-red-500' : 'text-emerald-500'}>
                {data.change}
              </span>
            </div>
          </div>
          <div className="relative">
            <Progress value={data.value} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${data.value}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          {data.details.map((detail, index) => (
            <div key={detail.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{detail.label}</span>
              <span className="font-medium">{detail.value}</span>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};