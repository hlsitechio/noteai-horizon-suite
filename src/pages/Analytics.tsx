
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import WritingStatsCard from '../components/Analytics/WritingStatsCard';
import DailyNotesChart from '../components/Analytics/DailyNotesChart';

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Sample content for writing stats (you might want to make this dynamic)
  const sampleContent = notes.length > 0 ? notes[0].content : '';

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <div className="flex-1 flex flex-col w-full px-6 py-6 space-y-6">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">
                Insights into your writing patterns and productivity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold">{totalNotes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Words</p>
                <p className="text-2xl font-bold">{totalWords.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{weeklyNotes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{favoriteNotes}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Analytics Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Writing Stats Card */}
          <motion.div variants={itemVariants}>
            <WritingStatsCard content={sampleContent} />
          </motion.div>

          {/* Daily Notes Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
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
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / totalNotes) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Writing Insights */}
          <motion.div variants={itemVariants} className="p-6 bg-card rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Writing Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average words per note</span>
                <span className="font-medium">{totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average characters per note</span>
                <span className="font-medium">{totalNotes > 0 ? Math.round(totalCharacters / totalNotes) : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Favorite rate</span>
                <span className="font-medium">{totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Analytics;
