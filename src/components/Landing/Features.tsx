
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI assistance to enhance your productivity and streamline your workflow with intelligent suggestions.',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.3)]'
    },
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
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools that bring your team together for maximum productivity.',
      gradient: 'from-pink-400 via-rose-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(236,72,153,0.3)]'
    }
  ];

  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
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
            Discover the powerful capabilities that make our platform the ultimate choice for modern professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative"
            >
              <Card className={`h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${feature.glow} hover:shadow-2xl`}>
                <CardContent className="p-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    {React.cloneElement(feature.icon, { className: "w-10 h-10 text-white" })}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
