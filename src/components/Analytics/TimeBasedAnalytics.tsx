import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Activity,
  Sun,
  Moon,
  Coffee,
  Sunset
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts';

interface TimeBasedAnalyticsProps {
  notes: any[];
}

const TimeBasedAnalytics: React.FC<TimeBasedAnalyticsProps> = ({ notes }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Generate hourly activity data
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const notesInHour = notes.filter(note => {
      const noteHour = new Date(note.createdAt).getHours();
      return noteHour === hour;
    }).length;

    return {
      hour,
      notes: notesInHour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      period: hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    };
  });

  // Generate daily activity data for the last 7 days
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    const notesOnDay = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.toDateString() === date.toDateString();
    }).length;

    return {
      date: date.toISOString().split('T')[0],
      notes: notesOnDay,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      words: notesOnDay * 150 // Estimated words
    };
  });

  // Find peak activity periods
  const peakHour = hourlyData.reduce((peak, current) => 
    current.notes > peak.notes ? current : peak, hourlyData[0]
  );

  const getMostActiveTime = () => {
    const morningNotes = hourlyData.filter(d => d.hour >= 6 && d.hour < 12).reduce((sum, d) => sum + d.notes, 0);
    const afternoonNotes = hourlyData.filter(d => d.hour >= 12 && d.hour < 18).reduce((sum, d) => sum + d.notes, 0);
    const eveningNotes = hourlyData.filter(d => d.hour >= 18 && d.hour < 24).reduce((sum, d) => sum + d.notes, 0);
    const nightNotes = hourlyData.filter(d => d.hour >= 0 && d.hour < 6).reduce((sum, d) => sum + d.notes, 0);

    const periods = [
      { name: 'Morning', count: morningNotes, icon: Sun, color: 'text-yellow-600' },
      { name: 'Afternoon', count: afternoonNotes, icon: Coffee, color: 'text-orange-600' },
      { name: 'Evening', count: eveningNotes, icon: Sunset, color: 'text-red-600' },
      { name: 'Night', count: nightNotes, icon: Moon, color: 'text-blue-600' }
    ];

    return periods.sort((a, b) => b.count - a.count)[0];
  };

  const mostActiveTime = getMostActiveTime();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="font-medium text-foreground">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="border-b border-border/5 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Time-Based Analytics
            </span>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              Discover your productivity patterns over time
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                {peakHour.hour < 12 ? <Sun className="h-5 w-5 text-blue-600" /> : 
                 peakHour.hour < 18 ? <Coffee className="h-5 w-5 text-blue-600" /> : 
                 <Moon className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Peak Hour</p>
                <p className="text-sm text-blue-600/80">{peakHour.label}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <mostActiveTime.icon className={`h-5 w-5 ${mostActiveTime.color}`} />
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Most Active</p>
                <p className="text-sm text-green-600/80">{mostActiveTime.name}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-700 dark:text-purple-300">Weekly Notes</p>
                <p className="text-sm text-purple-600/80">{dailyData.reduce((sum, d) => sum + d.notes, 0)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              24 Hours
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              7 Days
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="notes"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="week" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="notes"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="notes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="words"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeBasedAnalytics;