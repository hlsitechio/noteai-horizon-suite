
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Calendar, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNotes } from '@/contexts/NotesContext';

interface EnhancedAssistantAnalyticsProps {
  content: string;
}

const EnhancedAssistantAnalytics: React.FC<EnhancedAssistantAnalyticsProps> = ({ content }) => {
  const { notes } = useNotes();
  
  const wordCount = content.split(' ').filter(w => w.length > 0).length;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200);
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Generate daily notes creation data for the last 7 days
  const dailyNotesData = useMemo(() => {
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

  const stats = [
    { 
      label: 'Words', 
      value: wordCount.toLocaleString(), 
      color: 'blue',
      icon: BarChart3,
      trend: wordCount > 100 ? '+' : ''
    },
    { 
      label: 'Characters', 
      value: characterCount.toLocaleString(), 
      color: 'purple',
      icon: TrendingUp,
      trend: characterCount > 500 ? '+' : ''
    },
    { 
      label: 'Reading time', 
      value: `~${readingTime} min`, 
      color: 'green',
      icon: Clock,
      trend: readingTime > 2 ? '+' : ''
    },
    { 
      label: 'Sentences', 
      value: sentenceCount.toString(), 
      color: 'orange',
      icon: Calendar,
      trend: sentenceCount > 5 ? '+' : ''
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Main Analytics Card */}
      <motion.div variants={itemVariants}>
        <Card className="glass shadow-medium border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="font-bold text-gray-800 flex items-center gap-2 dark:text-slate-200">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              Writing Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-200 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 dark:border-slate-600/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                          {stat.label}
                        </span>
                      </div>
                      {stat.trend && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-green-100/50 text-green-700 border-0 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                      {stat.value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Notes Creation Chart */}
      <motion.div variants={itemVariants}>
        <Card className="glass shadow-medium border-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="font-bold text-gray-800 flex items-center gap-2 dark:text-slate-200">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Daily Notes Creation
              <Badge variant="secondary" className="ml-auto bg-blue-100/50 text-blue-700 border-0 dark:bg-blue-900/30 dark:text-blue-300">
                Last 7 days
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyNotesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="notesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="shortDate" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg dark:bg-slate-800/90 dark:border-slate-600/20">
                            <p className="font-semibold text-gray-900 dark:text-slate-100">{label}</p>
                            <p className="text-blue-600 dark:text-blue-400">
                              Notes: <span className="font-bold">{payload[0].value}</span>
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
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#notesGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Weekly Summary */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-slate-300">Weekly Summary:</span>
                <div className="flex items-center gap-4">
                  <span className="text-blue-600 font-semibold dark:text-blue-400">
                    {weeklyTrend.total} notes total
                  </span>
                  <span className="text-purple-600 font-semibold dark:text-purple-400">
                    {weeklyTrend.average} avg/day
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAssistantAnalytics;
