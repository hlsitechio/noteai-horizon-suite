import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Sparkles, TrendingUp, Calendar, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AnalyticsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  onRefresh, 
  onExport, 
  loading = false 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl" />
      
      <Card className="relative border-0 bg-background/50 backdrop-blur-sm shadow-lg">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Header content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover insights about your writing patterns and productivity
                </p>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="group transition-all duration-200 hover:shadow-md"
              >
                <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-45'}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="group transition-all duration-200 hover:shadow-md"
              >
                <Download className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" />
                Export
              </Button>
            </motion.div>
          </div>

          {/* Quick stats preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Growth Tracking</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Monitor your progress</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
              <Sparkles className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">AI Insights</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">Smart recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Time Analytics</p>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Usage patterns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalyticsHeader;