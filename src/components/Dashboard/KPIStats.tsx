
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import 'boxicons/css/boxicons.min.css';

interface KPIStatsProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes?: any[];
}

const KPIStats: React.FC<KPIStatsProps> = ({ 
  totalNotes, 
  favoriteNotes, 
  categoryCounts, 
  weeklyNotes,
  notes = []
}) => {
  // Calculate average words per note
  const averageWordsPerNote = React.useMemo(() => {
    if (notes.length === 0) return 0;
    
    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return acc + wordCount;
    }, 0);
    
    return Math.round(totalWords / notes.length);
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

  // Calculate total words written
  const totalWords = React.useMemo(() => {
    return notes.reduce((acc, note) => {
      const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
      return acc + wordCount;
    }, 0);
  }, [notes]);

  const stats = [
    {
      icon: 'bx bx-file',
      label: 'Total Notes',
      value: totalNotes.toLocaleString(),
      change: weeklyNotes > 0 ? `+${weeklyNotes} this week` : 'No new notes this week',
      changeType: weeklyNotes > 0 ? 'positive' : 'neutral',
      color: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: 'bx bx-trending-up',
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      change: averageWordsPerNote > 0 ? `${averageWordsPerNote} avg per note` : 'Start writing',
      changeType: averageWordsPerNote > 100 ? 'positive' : 'neutral',
      color: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: 'bx bx-star',
      label: 'Favorites',
      value: favoriteNotes.toString(),
      change: totalNotes > 0 ? `${Math.round((favoriteNotes / totalNotes) * 100)}% of all notes` : '0% of notes',
      changeType: favoriteNotes > 0 ? 'positive' : 'neutral',
      color: 'from-yellow-500/10 to-orange-500/10',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: 'bx bx-target-lock',
      label: 'Writing Streak',
      value: `${writingStreak} days`,
      change: writingStreak >= 7 ? 'Great consistency!' : writingStreak > 0 ? 'Keep it up!' : 'Start your streak',
      changeType: writingStreak >= 3 ? 'positive' : 'neutral',
      color: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: 'bx bx-calendar',
      label: 'This Week',
      value: weeklyNotes.toString(),
      change: weeklyNotes >= 5 ? 'Very productive!' : weeklyNotes >= 2 ? 'Good progress' : 'Room to grow',
      changeType: weeklyNotes >= 3 ? 'positive' : 'neutral',
      color: 'from-indigo-500/10 to-indigo-600/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: 'bx bx-time',
      label: 'Categories',
      value: Object.keys(categoryCounts).length.toString(),
      change: Object.keys(categoryCounts).length > 3 ? 'Well organized' : 'Add more variety',
      changeType: Object.keys(categoryCounts).length > 2 ? 'positive' : 'neutral',
      color: 'from-pink-500/10 to-rose-500/10',
      iconColor: 'text-pink-600 dark:text-pink-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
      {stats.map((stat, index) => {
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card className="border border-border/10 shadow-premium bg-card/80 backdrop-blur-xl hover:shadow-large transition-all duration-300 h-full group hover:border-accent/20">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg border border-white/10`}>
                    <i className={`${stat.icon} text-base ${stat.iconColor}`}></i>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground leading-none group-hover:text-accent transition-colors">
                    {stat.value}
                  </p>
                  <p className={`text-xs leading-tight ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPIStats;
