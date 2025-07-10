
import React from 'react';
import { motion } from 'framer-motion';
import FocusModeDemo from './FocusModeDemo';
import AIAssistantDemo from './AIAssistantDemo';
import PerformanceDemo from './PerformanceDemo';
import SecurityDemo from './SecurityDemo';
import DashboardScreenshot from './DashboardScreenshot';

const Features = () => {
  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent px-4">
            Revolutionary Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Experience the power of our platform with these interactive demos. Try them right here!
          </p>
        </motion.div>

        {/* Dashboard Screenshot */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              See It In Action
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get a preview of our powerful dashboard designed for maximum productivity
            </p>
          </motion.div>
          <DashboardScreenshot />
        </div>

        <div className="space-y-12 sm:space-y-20">
          {/* Focus Mode Demo */}
          <FocusModeDemo />

          {/* AI Assistant Demo */}
          <AIAssistantDemo />

          {/* Performance Demo */}
          <PerformanceDemo />

          {/* Security Demo */}
          <SecurityDemo />
        </div>
      </div>
    </section>
  );
};

export default Features;
