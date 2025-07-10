import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
const AnalyticsHeader: React.FC = () => {
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="flex-shrink-0">
      
    </motion.div>;
};
export default AnalyticsHeader;