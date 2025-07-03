
import React from 'react';
import { BarChart3, TrendingUp, Calendar, FileText, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotes } from '../../contexts/NotesContext';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const MobileAnalytics: React.FC = () => {
  const { notes } = useNotes();

  // Calculate analytics data
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(n => n.isFavorite).length;
  const todayNotes = notes.filter(n => 
    new Date(n.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const thisWeekNotes = notes.filter(n => {
    const noteDate = new Date(n.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate >= weekAgo;
  }).length;

  const avgWordsPerNote = Math.round(
    notes.reduce((acc, note) => acc + (note.content?.split(' ').length || 0), 0) / (totalNotes || 1)
  );

  const categoryStats = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsCards = [
    {
      title: 'Total Notes',
      value: totalNotes,
      description: 'All time',
      icon: FileText,
      trend: '+12%'
    },
    {
      title: 'This Week',
      value: thisWeekNotes,
      description: 'New notes',
      icon: Calendar,
      trend: '+8%'
    },
    {
      title: 'Favorites',
      value: favoriteNotes,
      description: 'Starred notes',
      icon: Target,
      trend: '+3%'
    },
    {
      title: 'Avg Words',
      value: avgWordsPerNote,
      description: 'Per note',
      icon: BarChart3,
      trend: '+15%'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <DynamicMobileHeader title="Analytics" />
      
      <div className="p-4 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <StatIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your writing activity this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Today</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((todayNotes / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{todayNotes}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">This week</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min((thisWeekNotes / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{thisWeekNotes}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
            <CardDescription>Distribution of your notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => {
                const countNum = count as number; // Type assertion for the count
                return (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(countNum / totalNotes) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{countNum}</span>
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Writing Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Writing Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most active day</span>
                <span className="text-sm font-medium">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Longest note</span>
                <span className="text-sm font-medium">
                  {Math.max(...notes.map(n => n.content?.length || 0))} chars
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Writing streak</span>
                <span className="text-sm font-medium">3 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default MobileAnalytics;
