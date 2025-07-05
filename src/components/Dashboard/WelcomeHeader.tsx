
import React from 'react';
import { motion } from 'framer-motion';
import WelcomeSection from './WelcomeSection';
import { DashboardBanner } from './DashboardBanner';

const WelcomeHeader: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Dashboard Banner */}
      <DashboardBanner
        minHeight={120}
        maxHeight={500}
        defaultHeight={224}
      />
    </motion.div>
  );
};

export default WelcomeHeader;
