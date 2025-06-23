
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import FeatureCard from './FeatureCard';

const staticFeaturesData = [
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

const StaticFeatures = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {staticFeaturesData.map((feature, index) => (
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
  );
};

export default StaticFeatures;
