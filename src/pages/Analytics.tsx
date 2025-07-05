
import React from 'react';
import { motion } from 'framer-motion';
import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import OverviewStats from '../components/Analytics/OverviewStats';
import CategoryDistribution from '../components/Analytics/CategoryDistribution';
import WritingInsights from '../components/Analytics/WritingInsights';
import AnalyticsOverview from '../components/Dashboard/AnalyticsOverview';
import AIUsageAnalytics from '../components/Dashboard/AIUsageAnalytics';

const Analytics: React.FC = () => {
  const { notes } = useOptimizedNotes();

  // Calculate stats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const categoryCounts = notes.reduce((acc, note) => {
    const category = note.category || 'general';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weeklyNotes = notes.filter(note => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(note.createdAt) > weekAgo;
  }).length;

  // Calculate word and character counts
  const totalWords = notes.reduce((acc, note) => {
    const wordCount = note.content ? note.content.split(/\s+/).filter(word => word.length > 0).length : 0;
    return acc + wordCount;
  }, 0);

  const totalCharacters = notes.reduce((acc, note) => {
    return acc + (note.content ? note.content.length : 0);
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AnalyticsHeader />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Overview Stats */}
          <OverviewStats
            totalNotes={totalNotes}
            totalWords={totalWords}
            weeklyNotes={weeklyNotes}
            favoriteNotes={favoriteNotes}
          />

          {/* Charts and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDistribution
              categoryCounts={categoryCounts}
              totalNotes={totalNotes}
            />
            
            <WritingInsights
              totalNotes={totalNotes}
              totalWords={totalWords}
              totalCharacters={totalCharacters}
              favoriteNotes={favoriteNotes}
            />
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsOverview
              totalNotes={totalNotes}
              favoriteNotes={favoriteNotes}
              categoryCounts={categoryCounts}
              weeklyNotes={weeklyNotes}
              notes={notes}
            />
            
            <AIUsageAnalytics />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
