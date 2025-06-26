
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const AnalyticsHeader: React.FC = () => {
  return (
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
  );
};

export default AnalyticsHeader;
