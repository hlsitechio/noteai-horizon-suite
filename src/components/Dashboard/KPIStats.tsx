
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
      color: 'blue'
    },
    {
      icon: 'bx bx-trending-up',
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      change: averageWordsPerNote > 0 ? `${averageWordsPerNote} avg per note` : 'Start writing',
      changeType: averageWordsPerNote > 100 ? 'positive' : 'neutral',
      color: 'green'
    },
    {
      icon: 'bx bx-star',
      label: 'Favorites',
      value: favoriteNotes.toString(),
      change: totalNotes > 0 ? `${Math.round((favoriteNotes / totalNotes) * 100)}% of all notes` : '0% of notes',
      changeType: favoriteNotes > 0 ? 'positive' : 'neutral',
      color: 'yellow'
    },
    {
      icon: 'bx bx-target-lock',
      label: 'Writing Streak',
      value: `${writingStreak} days`,
      change: writingStreak >= 7 ? 'Great consistency!' : writingStreak > 0 ? 'Keep it up!' : 'Start your streak',
      changeType: writingStreak >= 3 ? 'positive' : 'neutral',
      color: 'purple'
    },
    {
      icon: 'bx bx-calendar',
      label: 'This Week',
      value: weeklyNotes.toString(),
      change: weeklyNotes >= 5 ? 'Very productive!' : weeklyNotes >= 2 ? 'Good progress' : 'Room to grow',
      changeType: weeklyNotes >= 3 ? 'positive' : 'neutral',
      color: 'indigo'
    },
    {
      icon: 'bx bx-time',
      label: 'Categories',
      value: Object.keys(categoryCounts).length.toString(),
      change: Object.keys(categoryCounts).length > 3 ? 'Well organized' : 'Add more variety',
      changeType: Object.keys(categoryCounts).length > 2 ? 'positive' : 'neutral',
      color: 'pink'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {stats.map((stat, index) => {
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-1.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg`}>
                    <i className={`${stat.icon} text-sm text-${stat.color}-600 dark:text-${stat.color}-400`}></i>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
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
