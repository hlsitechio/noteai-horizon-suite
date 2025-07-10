
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Calendar, Heart, Target, Clock, Zap, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OverviewStatsProps {
  totalNotes: number;
  totalWords: number;
  weeklyNotes: number;
  favoriteNotes: number;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
  totalNotes,
  totalWords,
  weeklyNotes,
  favoriteNotes,
}) => {
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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Calculate additional metrics
  const averageWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;
  const weeklyGrowth = totalNotes > 0 ? Math.round((weeklyNotes / totalNotes) * 100) : 0;
  const favoriteRate = totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0;

  const stats = [
    {
      id: 'total-notes',
      icon: FileText,
      label: 'Total Notes',
      value: totalNotes.toLocaleString(),
      subtitle: 'All time',
      progress: Math.min((totalNotes / 100) * 100, 100),
      trend: '+12%',
      trendDirection: 'up',
      gradient: 'from-blue-500/20 via-blue-600/10 to-blue-500/5',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'total-words',
      icon: TrendingUp,
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      subtitle: `~${averageWordsPerNote} per note`,
      progress: Math.min((totalWords / 10000) * 100, 100),
      trend: '+8%',
      trendDirection: 'up',
      gradient: 'from-green-500/20 via-green-600/10 to-green-500/5',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 'weekly-notes',
      icon: Calendar,
      label: 'This Week',
      value: weeklyNotes.toString(),
      subtitle: `${weeklyGrowth}% of total`,
      progress: Math.min((weeklyNotes / 20) * 100, 100),
      trend: '+15%',
      trendDirection: 'up',
      gradient: 'from-purple-500/20 via-purple-600/10 to-purple-500/5',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 'favorites',
      icon: Heart,
      label: 'Favorites',
      value: favoriteNotes.toString(),
      subtitle: `${favoriteRate}% rate`,
      progress: favoriteRate,
      trend: '+5%',
      trendDirection: 'up',
      gradient: 'from-red-500/20 via-red-600/10 to-red-500/5',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          variants={itemVariants}
          whileHover={{ 
            y: -8, 
            transition: { type: "spring" as const, stiffness: 400, damping: 10 } 
          }}
          className="group cursor-pointer"
        >
          <Card className={`relative overflow-hidden border-2 ${stat.borderColor} bg-gradient-to-br ${stat.gradient} transition-all duration-300 group-hover:shadow-xl group-hover:shadow-current/5`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse" />
            </div>
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20`}
                >
                  {stat.trend}
                </motion.div>
              </div>

              <div className="space-y-3">
                <div>
                  <motion.p 
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm font-medium text-foreground/90">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>

                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="w-full"
                >
                  <Progress 
                    value={stat.progress} 
                    className="h-2 bg-white/10"
                  />
                </motion.div>
              </div>

              {/* Floating micro-animation elements */}
              <motion.div 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                <div className={`w-2 h-2 rounded-full ${stat.iconBg}`} />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OverviewStats;
