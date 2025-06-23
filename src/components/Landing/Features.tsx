
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import FocusModeDemo from './FocusModeDemo';
import AIAssistantDemo from './AIAssistantDemo';
import FeatureCard from './FeatureCard';

const Features = () => {
  const staticFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with instant responses and real-time collaboration across all your devices.',
      gradient: 'from-yellow-400 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.3)]'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to keep your data safe and protected at all times.',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]'
    }
  ];

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
          <div className="grid md:grid-cols-2 gap-8">
            {staticFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                glow={feature.glow}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
