
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { Note } from '../../types/note';

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
  notes,
}) => {
  // Weekly activity data
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.toDateString() === date.toDateString();
    }).length;
    
    weeklyData.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      notes: dayNotes
    });
  }

  // Category distribution
  const categoryData = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([category, count], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][index] || '#6B7280'
    }));

  console.log('Weekly data for chart:', weeklyData);
  console.log('Category data for chart:', categoryData);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Weekly Activity Chart */}
      <Card className="flex-1 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Activity
            <Badge variant="secondary" className="ml-auto">{weeklyNotes} this week</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[200px]">
          <div className="w-full h-full min-h-[180px]">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 'dataMax + 1']}
                />
                <Line
                  type="monotone"
                  dataKey="notes"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ 
                    fill: '#8B5CF6', 
                    strokeWidth: 2,
                    stroke: '#ffffff',
                    r: 4
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: '#8B5CF6',
                    stroke: '#ffffff',
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="flex-1 border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-500" />
            Categories
            <Badge variant="secondary" className="ml-auto">{Object.keys(categoryCounts).length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[120px]">
          <div className="flex items-center h-full min-h-[100px]">
            <div className="w-20 h-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 ml-4 space-y-1">
              {categoryData.length > 0 ? (
                categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground truncate">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{category.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No categories yet</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
