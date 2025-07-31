
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNotes } from '@/contexts/NotesContext';

const DailyNotesChart: React.FC = () => {
  const { notes } = useNotes();

  // Generate daily notes creation data for the last 7 days
  const dailyNotesData = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayNotes = notes.filter(note => {
        if (!note.createdAt) return false;
        const noteDate = new Date(note.createdAt);
        return noteDate.toDateString() === date.toDateString();
      }).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        shortDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
        notes: dayNotes,
        day: date.getDate()
      });
    }
    
    return last7Days;
  }, [notes]);

  // Calculate weekly trend
  const weeklyTrend = useMemo(() => {
    const thisWeek = dailyNotesData.reduce((sum, day) => sum + day.notes, 0);
    const avgDaily = thisWeek / 7;
    return { total: thisWeek, average: Math.round(avgDaily * 10) / 10 };
  }, [dailyNotesData]);

  return (
    <Card className="glass shadow-medium border-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <CardTitle className="font-bold text-white flex items-center gap-2 relative z-10">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Daily Notes Creation
          <Badge variant="secondary" className="ml-auto bg-cyan-900/50 text-cyan-300 border-cyan-500/30">
            Last 7 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 relative">
        <div className="h-64 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent rounded-lg" />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyNotesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="enhancedNotesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="25%" stopColor="#0891b2" stopOpacity={0.6}/>
                  <stop offset="50%" stopColor="#0e7490" stopOpacity={0.4}/>
                  <stop offset="75%" stopColor="#155e75" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#164e63" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="#334155" 
                strokeOpacity={0.3} 
                vertical={false}
              />
              <XAxis 
                dataKey="shortDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl">
                        <p className="font-semibold text-white text-sm mb-2">{label}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                          <span className="text-cyan-300 font-medium">
                            Notes: <span className="text-white font-bold text-lg">{payload[0].value}</span>
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="notes"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#enhancedNotesGradient)"
                dot={{ 
                  fill: '#06b6d4', 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#ffffff',
                  filter: 'url(#glow)'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#06b6d4', 
                  strokeWidth: 3, 
                  fill: '#ffffff',
                  filter: 'url(#glow)',
                  style: {
                    filter: 'drop-shadow(0 0 8px #06b6d4)'
                  }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Enhanced Weekly Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 font-medium">Weekly Summary:</span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                <span className="text-cyan-300 font-semibold">
                  {weeklyTrend.total} total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
                <span className="text-purple-300 font-semibold">
                  {weeklyTrend.average} avg/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNotesChart;
