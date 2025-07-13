import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, FileText, Clock, Target, Star } from 'lucide-react';

const MobileAnalytics: React.FC = () => {
  const analyticsData = [
    { label: 'Notes Created', value: '42', change: '+12%', isPositive: true, icon: FileText },
    { label: 'Time Spent', value: '24h', change: '+8%', isPositive: true, icon: Clock },
    { label: 'Goals Completed', value: '8/10', change: '+20%', isPositive: true, icon: Target },
    { label: 'Favorites', value: '12', change: '+4', isPositive: true, icon: Star },
  ];

  const weeklyData = [
    { day: 'Mon', notes: 6, time: 45 },
    { day: 'Tue', notes: 8, time: 60 },
    { day: 'Wed', notes: 4, time: 30 },
    { day: 'Thu', notes: 10, time: 75 },
    { day: 'Fri', notes: 7, time: 50 },
    { day: 'Sat', notes: 3, time: 20 },
    { day: 'Sun', notes: 4, time: 25 },
  ];

  const maxNotes = Math.max(...weeklyData.map(d => d.notes));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {analyticsData.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
                <div className={`flex items-center text-xs ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 text-xs font-medium text-muted-foreground">
                  {day.day}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium">{day.notes} notes</div>
                    <div className="text-xs text-muted-foreground">{day.time}min</div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(day.notes / maxNotes) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Most Productive Day
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              Thursday - 10 notes created in 75 minutes
            </div>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
            <div className="text-sm font-medium text-green-900 dark:text-green-100">
              Writing Streak
            </div>
            <div className="text-xs text-green-600 dark:text-green-300">
              You've been consistent for 7 days! Keep it up.
            </div>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
            <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Popular Tags
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-300">
              #work (15), #ideas (12), #research (8)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAnalytics;