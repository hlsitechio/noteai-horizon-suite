import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import NeuralNetwork3D from './NeuralNetwork3D';
import HolographicText from './HolographicText';
import CyberpunkCard from './CyberpunkCard';

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
        {/* Neural Mind Palace Headline */}
        <motion.div variants={itemVariants} className="mb-8">
          <HolographicText 
            className="text-6xl md:text-7xl lg:text-8xl font-neural font-black mb-6 leading-tight"
            glitchEffect={true}
          >
            <span className="block">Neural Mind</span>
            <span className="block text-neural-glow">Palace</span>
          </HolographicText>
        </motion.div>

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

        {/* Neural Network Visualization */}
        <motion.div 
          variants={itemVariants}
          className="relative max-w-5xl mx-auto"
        >
          <CyberpunkCard variant="neural" className="p-8">
            <div className="relative">
              <NeuralNetwork3D 
                nodeCount={40}
                width={1000}
                height={400}
                interactive={true}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-background/20 backdrop-blur-sm rounded-2xl p-8 border border-primary/30">
                  <HolographicText className="text-2xl font-cyber font-bold mb-2">
                    AI-Powered Neural Network
                  </HolographicText>
                  <p className="text-foreground/80 font-cyber">Your thoughts, connected intelligently</p>
                </div>
              </div>
            </div>
          </CyberpunkCard>
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