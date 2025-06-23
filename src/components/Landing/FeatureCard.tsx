
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  gradient: string;
  glow: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, gradient, glow, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="group relative"
    >
      <Card className={`h-full bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${glow} hover:shadow-2xl`}>
        <CardContent className="p-10">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
            {React.cloneElement(icon, { className: "w-10 h-10 text-white" })}
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">{title}</h3>
          <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
