
import React from 'react';
import { motion } from 'framer-motion';
import { useNotes } from '../contexts/NotesContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import AnalyticsHeader from '../components/Analytics/AnalyticsHeader';
import OverviewStats from '../components/Analytics/OverviewStats';
import WritingStatsCard from '../components/Analytics/WritingStatsCard';
import DailyNotesChart from '../components/Analytics/DailyNotesChart';
import CategoryDistribution from '../components/Analytics/CategoryDistribution';
import WritingInsights from '../components/Analytics/WritingInsights';

const Analytics: React.FC = () => {
  const { notes } = useNotes();

  // Calculate analytics data
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  const totalWords = notes.reduce((acc, note) => {
    return acc + note.content.split(' ').filter(w => w.length > 0).length;
  }, 0);
  const totalCharacters = notes.reduce((acc, note) => acc + note.content.length, 0);

  const weeklyNotes = notes.filter(note => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(note.createdAt) > weekAgo;
  }).length;

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Enhanced AI context integration
  useQuantumAIIntegration({
    page: '/app/analytics',
    content: `Analytics overview: ${totalNotes} total notes, ${totalWords} total words, ${favoriteNotes} favorites`,
    metadata: {
      totalNotes,
      favoriteNotes,
      weeklyNotes,
      totalWords,
      totalCharacters,
      categoryCounts
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Sample content for writing stats (you might want to make this dynamic)
  const sampleContent = notes.length > 0 ? notes[0].content : '';

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1 flex flex-col w-full px-6 py-6 space-y-6">
        
        {/* Page Header */}
        <AnalyticsHeader />

        {/* Overview Stats */}
        <OverviewStats
          totalNotes={totalNotes}
          totalWords={totalWords}
          weeklyNotes={weeklyNotes}
          favoriteNotes={favoriteNotes}
        />

        {/* Main Analytics Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Writing Stats Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <WritingStatsCard content={sampleContent} />
          </motion.div>

          {/* Daily Notes Chart */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-1">
            <DailyNotesChart />
          </motion.div>
        </motion.div>

        {/* Additional Analytics Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Category Distribution */}
          <CategoryDistribution
            categoryCounts={categoryCounts}
            totalNotes={totalNotes}
          />

          {/* Writing Insights */}
          <WritingInsights
            totalNotes={totalNotes}
            totalWords={totalWords}
            totalCharacters={totalCharacters}
            favoriteNotes={favoriteNotes}
          />
        </motion.div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Analytics;
