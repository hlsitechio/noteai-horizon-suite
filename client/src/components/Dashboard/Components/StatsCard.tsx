import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { ComponentLibraryButton } from './ComponentLibraryButton';

interface StatsCardProps {
  variant?: 'revenue' | 'users' | 'views' | 'growth';
}

export const StatsCard: React.FC<StatsCardProps> = ({ variant = 'revenue' }) => {
  const statsData = {
    revenue: {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      period: 'from last month',
      color: 'text-emerald-600'
    },
    users: {
      title: 'Active Users',
      value: '2,845',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      period: 'from last week',
      color: 'text-blue-600'
    },
    views: {
      title: 'Page Views',
      value: '12,234',
      change: '-2.1%',
      trend: 'down',
      icon: Eye,
      period: 'from yesterday',
      color: 'text-purple-600'
    },
    growth: {
      title: 'Growth Rate',
      value: '8.5%',
      change: '0.0%',
      trend: 'neutral',
      icon: TrendingUp,
      period: 'this month',
      color: 'text-orange-600'
    }
  };

  const data = statsData[variant];
  const Icon = data.icon;
  
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <ArrowUpRight className="h-3 w-3 text-emerald-500" />;
      case 'down':
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-emerald-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="h-full group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {data.title}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Icon className={`h-4 w-4 ${data.color}`} />
          <ComponentLibraryButton componentName="stats card" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{data.value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {getTrendIcon()}
          <span className={getTrendColor()}>{data.change}</span>
          <span>{data.period}</span>
        </div>
      </CardContent>
    </Card>
  );
};