
import React from 'react';
import { motion } from 'framer-motion';
import WritingStatsCard from '../Analytics/WritingStatsCard';
import DailyNotesChart from '../Analytics/DailyNotesChart';

interface EnhancedAssistantAnalyticsProps {
  content: string;
}

const EnhancedAssistantAnalytics: React.FC<EnhancedAssistantAnalyticsProps> = ({ content }) => {
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
      {/* Writing Stats Card */}
      <motion.div variants={itemVariants}>
        <WritingStatsCard content={content} />
      </motion.div>

      {/* Daily Notes Chart */}
      <motion.div variants={itemVariants}>
        <DailyNotesChart />
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAssistantAnalytics;
