
import React from 'react';
import { motion } from 'framer-motion';

interface WritingInsightsProps {
  totalNotes: number;
  totalWords: number;
  totalCharacters: number;
  favoriteNotes: number;
}

const WritingInsights: React.FC<WritingInsightsProps> = ({
  totalNotes,
  totalWords,
  totalCharacters,
  favoriteNotes,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const insights = [
    {
      label: 'Average words per note',
      value: totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0,
    },
    {
      label: 'Average characters per note',
      value: totalNotes > 0 ? Math.round(totalCharacters / totalNotes) : 0,
    },
    {
      label: 'Favorite rate',
      value: `${totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0}%`,
    },
  ];

  return (
    <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Writing Insights</h3>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{insight.label}</span>
            <span className="font-medium">{insight.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WritingInsights;
