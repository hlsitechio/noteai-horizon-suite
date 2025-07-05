
import React from 'react';
import { motion } from 'framer-motion';
import 'boxicons/css/boxicons.min.css';

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      icon: 'bx bx-bar-chart',
      label: 'Total Notes',
      value: totalNotes,
      color: 'blue',
    },
    {
      icon: 'bx bx-trending-up',
      label: 'Total Words',
      value: totalWords.toLocaleString(),
      color: 'green',
    },
    {
      icon: 'bx bx-calendar',
      label: 'This Week',
      value: weeklyNotes,
      color: 'purple',
    },
    {
      icon: 'bx bx-time',
      label: 'Favorites',
      value: favoriteNotes,
      color: 'orange',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => {
        return (
          <motion.div 
            key={stat.label}
            variants={itemVariants} 
            className="p-6 bg-card rounded-xl border shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-lg`}>
                <i className={`${stat.icon} text-lg text-${stat.color}-600 dark:text-${stat.color}-400`}></i>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default OverviewStats;
