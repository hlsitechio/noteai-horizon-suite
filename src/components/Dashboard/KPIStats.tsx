import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Star, Calendar, TrendingUp, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  content?: string;
  createdAt: string;
}

interface KPIStatsProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes?: Note[];
}

const calculateWordCount = (notes: Note[]) =>
  notes.reduce((acc, note) => acc + (note.content?.split(/\s+/).filter(Boolean).length || 0), 0);

const calculateWritingStreak = (notes: Note[]) => {
  if (!notes.length) return 0;

  const dates = new Set(
    notes.map((note) => new Date(note.createdAt).toDateString())
  );

  let streak = 0;
  let date = new Date();

  for (let i = 0; i < 30; i++) {
    if (dates.has(date.toDateString())) streak++;
    else if (i > 0) break;
    date.setDate(date.getDate() - 1);
  }

  return streak;
};

const KPIStats: React.FC<KPIStatsProps> = ({
  totalNotes,
  favoriteNotes,
  categoryCounts,
  weeklyNotes,
  notes = [],
}) => {
  const totalWords = useMemo(() => calculateWordCount(notes), [notes]);
  const averageWordsPerNote = notes.length ? Math.round(totalWords / notes.length) : 0;
  const writingStreak = useMemo(() => calculateWritingStreak(notes), [notes]);
  const categoryCount = Object.keys(categoryCounts).length;

  const stats = [
    {
      icon: FileText,
      label: 'Total Notes',
      value: totalNotes.toLocaleString(),
      change: weeklyNotes ? `+${weeklyNotes} this week` : 'No new notes this week',
      isPositive: weeklyNotes > 0,
      color: 'blue',
    },
    {
      icon: TrendingUp,
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      change: averageWordsPerNote ? `${averageWordsPerNote} avg per note` : 'Start writing',
      isPositive: averageWordsPerNote > 100,
      color: 'green',
    },
    {
      icon: Star,
      label: 'Favorites',
      value: favoriteNotes.toString(),
      change: totalNotes ? `${Math.round((favoriteNotes / totalNotes) * 100)}% of notes` : '0% of notes',
      isPositive: favoriteNotes > 0,
      color: 'yellow',
    },
    {
      icon: Target,
      label: 'Writing Streak',
      value: `${writingStreak} days`,
      change:
        writingStreak >= 7
          ? 'Great consistency!'
          : writingStreak
          ? 'Keep it up!'
          : 'Start your streak',
      isPositive: writingStreak >= 3,
      color: 'purple',
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: weeklyNotes.toString(),
      change:
        weeklyNotes >= 5 ? 'Very productive!' : weeklyNotes >= 2 ? 'Good progress' : 'Room to grow',
      isPositive: weeklyNotes >= 3,
      color: 'indigo',
    },
    {
      icon: Clock,
      label: 'Categories',
      value: categoryCount.toString(),
      change: categoryCount > 3 ? 'Well organized' : 'Add more variety',
      isPositive: categoryCount > 2,
      color: 'pink',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="border shadow-sm bg-card/50 backdrop-blur-xl hover:shadow-md transition-all duration-200 h-full">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                <p
                  className={`text-xs leading-tight ${
                    stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default KPIStats;
