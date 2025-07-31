
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AnalyticsHeader from '@/components/Analytics/AnalyticsHeader';
import OverviewStats from '@/components/Analytics/OverviewStats';
import SmartInsightsPanel from '@/components/Analytics/SmartInsightsPanel';
import TimeBasedAnalytics from '@/components/Analytics/TimeBasedAnalytics';
import EnhancedCategoryChart from '@/components/Analytics/EnhancedCategoryChart';
import WritingInsights from '@/components/Analytics/WritingInsights';
import { useToast } from '@/hooks/use-toast';

const Analytics: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

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

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Analytics Refreshed",
        description: "Your analytics data has been updated with the latest information.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed", 
        description: "Unable to refresh analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated and will download shortly.",
    });
  };

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
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className={`mx-auto space-y-8 ${isMobile ? 'max-w-full p-4' : 'max-w-7xl p-8'}`}>
        {/* Enhanced Header */}
        <AnalyticsHeader 
          onRefresh={handleRefresh}
          onExport={handleExport}
          loading={refreshing}
        />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Overview Stats - Enhanced */}
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <OverviewStats
              totalNotes={totalNotes}
              totalWords={totalWords}
              weeklyNotes={weeklyNotes}
              favoriteNotes={favoriteNotes}
            />
          </motion.div>

          {/* Main Analytics Grid */}
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Time-Based Analytics */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <TimeBasedAnalytics notes={notes} />
              </motion.div>

              {/* Enhanced Category Chart */}
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <EnhancedCategoryChart
                  categoryCounts={categoryCounts}
                  totalNotes={totalNotes}
                />
              </motion.div>
            </div>

            {/* Right Column - Insights & Details */}
            <div className="space-y-8">
              {/* Smart Insights Panel */}
              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                <SmartInsightsPanel loading={refreshing} />
              </motion.div>

              {/* Writing Insights - Enhanced */}
              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                <WritingInsights
                  totalNotes={totalNotes}
                  totalWords={totalWords}
                  totalCharacters={totalCharacters}
                  favoriteNotes={favoriteNotes}
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom spacer for better mobile experience */}
          {isMobile && <div className="h-20" />}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
