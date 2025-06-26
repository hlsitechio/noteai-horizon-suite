
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface WritingStatsCardProps {
  content: string;
}

const WritingStatsCard: React.FC<WritingStatsCardProps> = ({ content }) => {
  const wordCount = content.split(' ').filter(w => w.length > 0).length;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200);
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  const stats = [
    { 
      label: 'Words', 
      value: wordCount.toLocaleString(), 
      color: 'blue',
      trend: wordCount > 100 ? '+' : ''
    },
    { 
      label: 'Characters', 
      value: characterCount.toLocaleString(), 
      color: 'purple',
      trend: characterCount > 500 ? '+' : ''
    },
    { 
      label: 'Reading time', 
      value: `~${readingTime} min`, 
      color: 'green',
      trend: readingTime > 2 ? '+' : ''
    },
    { 
      label: 'Sentences', 
      value: sentenceCount.toString(), 
      color: 'orange',
      trend: sentenceCount > 5 ? '+' : ''
    }
  ];

  return (
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
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-200 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 dark:border-slate-600/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  {stat.label}
                </span>
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WritingStatsCard;
