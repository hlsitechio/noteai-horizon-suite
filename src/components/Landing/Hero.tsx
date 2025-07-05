import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Rocket, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardDemo from './DashboardDemo';

const Hero = () => {
  const navigate = useNavigate();

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.06,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const animatedTexts = [
    "Experience the revolution in AI-driven note-taking and productivity.",
    "Create, collaborate, and innovate with unprecedented intelligence.",
    "Unlock your full potential with smart, automated workflows.",
    "Transform your ideas into action with seamless organization.",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, [animatedTexts.length]);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-6xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full px-6 py-3 backdrop-blur-xl"
          >
            <Star className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Next-Gen AI Technology</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-flow">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-flow">
              Smart Productivity
            </span>
          </h1>

          <div className="h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                variants={sentence}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 text-center"
              >
                {animatedTexts[currentTextIndex].split(" ").map((word, index) => (
                  <motion.span key={word + "-" + index} variants={letter}>
                    {word}{" "}
                  </motion.span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8 px-4">
            <div className="relative group w-full sm:w-auto">
        <Button
          onClick={() => navigate('/register')}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white px-8 sm:px-10 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] transition-all duration-500 transform hover:scale-105"
              >
                <Rocket className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                Start Free Trial
              </Button>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-6 text-lg sm:text-xl font-semibold rounded-2xl text-white hover:bg-white/10 backdrop-blur-xl transition-all duration-300 transform hover:scale-105"
            >
              <Globe className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 sm:pt-16 max-w-2xl mx-auto px-4"
          >
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Dashboard Demo Modal */}
      <DashboardDemo 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </section>
  );
};

export default Hero;
