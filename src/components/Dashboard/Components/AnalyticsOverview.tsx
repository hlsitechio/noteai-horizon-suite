import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Eye, 
  FileText, 
  Clock
} from 'lucide-react';

const metrics = [
  {
    id: '1',
    label: 'Total Notes',
    value: '247',
    change: '+12%',
    trend: 'up',
    period: 'vs last month'
  },
  {
    id: '2',
    label: 'Words Written',
    value: '15.2K',
    change: '+8.3%',
    trend: 'up',
    period: 'this week'
  },
  {
    id: '3',
    label: 'Time Spent',
    value: '42h',
    change: '-5%',
    trend: 'down',
    period: 'this week'
  },
  {
    id: '4',
    label: 'Views',
    value: '1,284',
    change: '+23%',
    trend: 'up',
    period: 'total'
  }
];

const chartData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 38 },
  { day: 'Thu', value: 65 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 30 },
  { day: 'Sun', value: 42 }
];

export function AnalyticsOverview() {
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Analytics Overview</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Last 7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-lg font-semibold text-foreground">
                  {metric.value}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {metric.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini Chart */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Daily Activity</span>
            <BarChart3 className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between h-16 space-x-1">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                <div 
                  className="w-full bg-primary rounded-sm min-h-[4px]"
                  style={{ 
                    height: `${(data.value / maxValue) * 48}px`
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {data.day.charAt(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Icons */}
        <div className="flex items-center justify-around pt-2 border-t">
          <div className="flex flex-col items-center space-y-1">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-muted-foreground">Documents</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Eye className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Views</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-muted-foreground">Time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}