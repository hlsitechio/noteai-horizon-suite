import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const PremiumHero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: '10%', y: '20%' },
    { Icon: Zap, delay: 1, x: '80%', y: '30%' },
    { Icon: Shield, delay: 2, x: '15%', y: '70%' },
    { Icon: Rocket, delay: 1.5, x: '85%', y: '60%' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 lg:px-8">
      {/* Background with subtle beam effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center"
      >
        {/* Main Headline - Huly Style */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">Everything App</span>
          <br />
          <span className="text-foreground">for your </span>
          <span className="text-primary">notes</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Online Note AI, an open-source platform, serves as an all-in-one replacement for Notion, Obsidian, and traditional note-taking apps.
        </motion.p>

        {/* CTA Button - Huly Style */}
        <motion.div 
          variants={itemVariants}
          className="mb-16"
        >
          <Link to="/register">
            <Button 
              size="lg" 
              className="px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Try it Free
            </Button>
          </Link>
        </motion.div>

        {/* Product Screenshot Placeholder */}
        <motion.div 
          variants={itemVariants}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock Interface */}
            <div className="bg-muted/50 p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your AI Note-Taking Workspace</h3>
                <p className="text-muted-foreground">Intelligent, organized, and always accessible</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature List - Huly Style */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-sm text-muted-foreground"
        >
          <p className="mb-4">Everything you need for productive note-taking:</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-2xl mx-auto">
            <span>• AI Writing Assistant</span>
            <span>• Smart Organization</span>
            <span>• Real-time Sync</span>
            <span>• Collaborative Editing</span>
            <span>• Advanced Search</span>
            <span>• Export Options</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;