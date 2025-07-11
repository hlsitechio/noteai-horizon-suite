import React from 'react';
import { Search, TrendingUp, Eye, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const SEOHeader: React.FC = () => {
  const stats = [
    {
      title: 'SEO Score',
      value: '78',
      unit: '/100',
      icon: TrendingUp,
      trend: '+5',
      color: 'text-green-500'
    },
    {
      title: 'Organic Traffic',
      value: '12.4K',
      unit: 'visits',
      icon: Eye,
      trend: '+12%',
      color: 'text-blue-500'
    },
    {
      title: 'Keywords Ranking',
      value: '145',
      unit: 'keywords',
      icon: Search,
      trend: '+8',
      color: 'text-purple-500'
    },
    {
      title: 'Page Speed',
      value: '89',
      unit: '/100',
      icon: BarChart3,
      trend: '+3',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your website's search engine performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end space-x-2 mt-2">
                <p className="text-2xl font-bold">
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className={`text-sm font-medium ${stat.color}`}>
                  {stat.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};