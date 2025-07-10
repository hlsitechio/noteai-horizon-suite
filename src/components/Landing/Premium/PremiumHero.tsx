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
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 lg:px-8 overflow-hidden">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: delay + 2, duration: 1 }}
          className="absolute hidden lg:block"
          style={{ left: x, top: y }}
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-16 h-16 text-primary" />
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <Badge 
            variant="outline" 
            className="px-6 py-2 text-sm font-medium bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Excellence
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight"
        >
          <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Transform Your
          </span>
          <br />
          <span className="bg-[var(--gradient-premium)] bg-clip-text text-transparent bg-size-200 animate-gradient-flow">
            Ideas Into Reality
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Experience the future of note-taking with AI that understands your thoughts, 
          enhances your creativity, and transforms your workflow into something extraordinary.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <Link to="/register">
            <Button 
              size="lg" 
              className="px-12 py-6 text-lg bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-premium)] transform hover:scale-105 transition-all duration-300 group min-w-[240px]"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link to="#showcase">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-12 py-6 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 min-w-[240px]"
            >
              Watch Demo
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { number: '10M+', label: 'Notes Created', delay: 0 },
            { number: '99.9%', label: 'Uptime Guarantee', delay: 0.1 },
            { number: '150+', label: 'Countries Served', delay: 0.2 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 + stat.delay, duration: 0.6 }}
              className="group"
            >
              <div className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;