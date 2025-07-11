import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export const SEOAnalysis: React.FC = () => {
  const seoIssues = [
    {
      type: 'error',
      title: 'Missing Meta Descriptions',
      count: 12,
      severity: 'high',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      type: 'warning',
      title: 'Slow Page Load Times',
      count: 8,
      severity: 'medium',
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      type: 'success',
      title: 'Optimized Images',
      count: 45,
      severity: 'good',
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ];

  const rankingData = [
    { keyword: 'note taking app', position: 3, change: '+2', trend: 'up' },
    { keyword: 'productivity tools', position: 7, change: '+1', trend: 'up' },
    { keyword: 'digital notebook', position: 12, change: '-3', trend: 'down' },
    { keyword: 'AI writing assistant', position: 5, change: '+4', trend: 'up' },
    { keyword: 'document management', position: 15, change: '0', trend: 'stable' }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>SEO Health Score</CardTitle>
          <CardDescription>Overall website SEO performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">78/100</span>
            <Badge variant="secondary" className="text-green-600">Good</Badge>
          </div>
          <Progress value={78} className="w-full" />
          
          <div className="space-y-3">
            {seoIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <issue.icon className={`h-4 w-4 ${issue.color}`} />
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">{issue.count} issues found</p>
                  </div>
                </div>
                <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'secondary' : 'default'}>
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyword Rankings</CardTitle>
          <CardDescription>Your top performing keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.keyword}</p>
                  <p className="text-sm text-muted-foreground">Position #{item.position}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                    {item.change}
                  </Badge>
                  <TrendingUp className={`h-4 w-4 ${
                    item.trend === 'up' ? 'text-green-500' : 
                    item.trend === 'down' ? 'text-red-500 rotate-180' : 
                    'text-gray-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};