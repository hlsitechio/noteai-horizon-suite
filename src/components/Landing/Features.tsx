
import React from 'react';
import { motion } from 'framer-motion';
import FocusModeDemo from './FocusModeDemo';
import AIAssistantDemo from './AIAssistantDemo';
import StaticFeatures from './StaticFeatures';

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
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Revolutionary Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of our platform with these interactive demos. Try them right here!
          </p>
        </motion.div>

        <div className="space-y-20">
          {/* Focus Mode Demo */}
          <FocusModeDemo />

          {/* AI Assistant Demo */}
          <AIAssistantDemo />

          {/* Static Feature Cards */}
          <StaticFeatures />
        </div>
      </div>
    </section>
  );
};

export default Features;
