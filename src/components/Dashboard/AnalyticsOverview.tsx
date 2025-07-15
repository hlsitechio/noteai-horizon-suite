
import React from 'react';
import type { Note, AnalyticsData, TooltipData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsOverviewProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes: Note[];
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  totalNotes,
  favoriteNotes,
  categoryCounts,
  weeklyNotes,
  notes
}) => {
  const { user } = useAuth();

  // Generate weekly activity data from real user notes
  const weeklyData = React.useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate.toDateString() === date.toDateString();
      }).length;
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        notes: dayNotes,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return last7Days;
  }, [notes]);

  // Category distribution data from real user notes
  const categoryData = React.useMemo(() => {
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
    return Object.entries(categoryCounts).map(([category, count], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: colors[index % colors.length],
      percentage: totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0
    }));
  }, [categoryCounts, totalNotes]);

  // Monthly trend data from real user notes
  const monthlyData = React.useMemo(() => {
    const monthsMap = new Map();
    const currentDate = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthsMap.set(monthKey, { notes: 0, favorites: 0 });
    }
    
    // Count notes and favorites by month
    notes.forEach(note => {
      const noteDate = new Date(note.createdAt);
      const monthKey = noteDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (monthsMap.has(monthKey)) {
        const monthData = monthsMap.get(monthKey);
        monthData.notes += 1;
        if (note.isFavorite) {
          monthData.favorites += 1;
        }
        monthsMap.set(monthKey, monthData);
      }
    });
    
    return Array.from(monthsMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }));
  }, [notes]);

  // Calculate writing streak
  const writingStreak = React.useMemo(() => {
    if (notes.length === 0) return 0;
    
    const sortedNotes = [...notes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasNoteOnDay = sortedNotes.some(note => {
        const noteDate = new Date(note.createdAt);
        noteDate.setHours(0, 0, 0, 0);
        return noteDate.getTime() === currentDate.getTime();
      });
      
      if (hasNoteOnDay) {
        streak++;
      } else if (i > 0) { // Don't break on first day if no notes today
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }, [notes]);

  // Calculate average words per note
  const averageWordsPerNote = React.useMemo(() => {
    if (notes.length === 0) return 0;
    
    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return acc + wordCount;
    }, 0);
    
    return Math.round(totalWords / notes.length);
  }, [notes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Weekly Activity Chart */}
      <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 text-accent" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                          <p className="text-xs font-medium">{label}</p>
                          <p className="text-xs text-accent">
                            Notes: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="notes"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#activityGradient)"
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="w-4 h-4 text-accent" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between h-32">
            {categoryData.length > 0 ? (
              <>
                <div className="h-24 w-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                                <p className="text-xs font-medium">{data.name}</p>
                                <p className="text-xs text-accent">
                                  {data.value} notes ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4 space-y-2">
                  {categoryData.slice(0, 3).map((category, index) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {category.name}
                      </span>
                      <span className="text-xs font-medium">{category.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                <p className="text-xs">No categories yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Metrics */}
      <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Target className="w-4 h-4 text-accent" />
            Progress Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Favorite Rate</span>
                <span className="font-medium">{totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-accent h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalNotes > 0 ? (favoriteNotes / totalNotes) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Weekly Goal</span>
                <span className="font-medium">{Math.min(weeklyNotes, 10)}/10</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((weeklyNotes / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Writing Streak</span>
                <span className="font-medium">{writingStreak} days</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((writingStreak / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="w-4 h-4 text-accent" />
            Monthly Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
                          <p className="text-xs font-medium">{label}</p>
                          <p className="text-xs text-accent">
                            Notes: {payload[0].value}
                          </p>
                          <p className="text-xs text-green-500">
                            Favorites: {payload[1]?.value || 0}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="notes" 
                  fill="hsl(var(--accent))" 
                  radius={[2, 2, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  dataKey="favorites" 
                  fill="hsl(var(--primary))" 
                  radius={[2, 2, 0, 0]}
                  opacity={0.6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-muted-foreground">All Notes</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">Favorites</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
