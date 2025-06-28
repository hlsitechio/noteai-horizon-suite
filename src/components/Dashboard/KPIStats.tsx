
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Heart, 
  TrendingUp, 
  Calendar,
  Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Note } from '../../types/note';

interface KPIStatsProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes: Note[];
}

const KPIStats: React.FC<KPIStatsProps> = ({
  totalNotes,
  favoriteNotes,
  categoryCounts,
  weeklyNotes,
  notes,
}) => {
  const totalWords = notes.reduce((acc, note) => {
    const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
    return acc + wordCount;
  }, 0);

  const avgWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  const stats = [
    {
      icon: FileText,
      value: totalNotes,
      label: 'Notes',
      color: 'bg-blue-500',
      detail: weeklyNotes > 0 ? `+${weeklyNotes} this week` : null
    },
    {
      icon: Heart,
      value: favoriteNotes,
      label: 'Favorites',
      color: 'bg-rose-500',
      detail: totalNotes > 0 ? `${Math.round((favoriteNotes / totalNotes) * 100)}%` : '0%'
    },
    {
      icon: TrendingUp,
      value: avgWordsPerNote,
      label: 'Avg Words',
      color: 'bg-green-500',
      detail: totalWords > 0 ? `${totalWords.toLocaleString()} total` : null
    },
    {
      icon: Tag,
      value: Object.keys(categoryCounts).length,
      label: 'Categories',
      color: 'bg-purple-500',
      detail: topCategories.length > 0 ? topCategories[0][0] : null
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:from-card/90 hover:to-card/50 transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-3 h-full">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground truncate">{stat.label}</div>
                  {stat.detail && (
                    <div className="text-xs text-muted-foreground/80 mt-1">{stat.detail}</div>
                  )}
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
