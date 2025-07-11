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
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Dynamic Background with Quantum Gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 animate-gradient-flow" style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--primary))_0deg,hsl(var(--accent))_120deg,hsl(var(--secondary))_240deg,hsl(var(--primary))_360deg)] opacity-[0.03] animate-gradient-mesh" />
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float-gentle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-secondary/6 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      
      {/* Radial Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-accent/8 via-accent/4 to-transparent rounded-full animate-glow" />
      </div>
      
      <div className="relative max-w-6xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-flex items-center space-x-3 bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20 rounded-full px-8 py-4 backdrop-blur-xl border border-primary/20 shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full animate-pulse-glow" />
            <Star className="w-5 h-5 text-primary animate-float relative z-10" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent relative z-10">
              Next-Gen AI Technology
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse relative z-10" />
          </motion.div>

          {/* Dynamic Hero Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight font-neural">
            <motion.span 
              className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-flow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The Future of
            </motion.span>
            <br />
            <motion.span 
              className="block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-flow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ animationDelay: '1s' }}
            >
              Smart Productivity
            </motion.span>
          </h1>

          {/* Enhanced Description Text */}
          <div className="h-28 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTextIndex}
                variants={sentence}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed px-4 text-center font-medium"
              >
                {animatedTexts[currentTextIndex].split(" ").map((word, index) => (
                  <motion.span 
                    key={word + "-" + index} 
                    variants={letter}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 px-4">
            <motion.div 
              className="relative group w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="relative w-full sm:w-auto bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-primary-foreground px-10 py-6 text-xl font-bold rounded-2xl shadow-premium hover:shadow-glow transition-all duration-500 border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Rocket className="mr-3 w-6 h-6 relative z-10 animate-float" />
                <span className="relative z-10">Start Free Trial</span>
              </Button>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10" />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDemoOpen(true)}
                className="relative w-full sm:w-auto px-10 py-6 text-xl font-semibold rounded-2xl border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 backdrop-blur-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Globe className="mr-3 w-6 h-6 relative z-10 group-hover:text-primary transition-colors duration-300" />
                <span className="relative z-10">Watch Demo</span>
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-6 sm:gap-12 pt-16 sm:pt-20 max-w-3xl mx-auto px-4"
          >
            {[
              { number: '50K+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-flow mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-foreground/60 text-sm sm:text-base font-medium group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
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
