
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryDistributionProps {
  categoryCounts: Record<string, number>;
  totalNotes: number;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({
  categoryCounts,
  totalNotes,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
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
  );
};

export default CategoryDistribution;
