import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConstellationNetwork from '../components/Landing/Constellation/ConstellationNetwork';
import DataFlowBackground from '../components/Landing/Constellation/DataFlowBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Network, TrendingUp } from 'lucide-react';

const ConstellationLanding: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground overflow-hidden">
      {/* Constellation Data Flow Background */}
      <DataFlowBackground 
        mousePosition={mousePosition} 
        scrollProgress={scrollProgress}
      />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DataFlow
          </span>
        </motion.div>

        <motion.div 
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a href="#insights" className="text-foreground/80 hover:text-foreground transition-colors">
            Insights
          </a>
          <a href="#solutions" className="text-foreground/80 hover:text-foreground transition-colors">
            Solutions
          </a>
          <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
            Contact
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Request Demo
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 lg:px-12 text-center">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Floating Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Unveiling Hidden Data Patterns</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Unlock insights.
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              Visualize your data.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Transform raw data into compelling stories with our cutting-edge visualization tools.
            Discover patterns, connections, and insights hidden in your data constellation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Explore the Universe
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/30 hover:border-primary/50 px-8 py-4 text-lg"
            >
              Watch Demo
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Constellation Network Overlay */}
        <ConstellationNetwork 
          mousePosition={mousePosition}
          scrollProgress={scrollProgress}
        />
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Interactive Data Exploration
              </span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Navigate through complex data relationships with our intuitive constellation engine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: "Connected Insights",
                description: "Visualize complex data relationships through interactive network maps"
              },
              {
                icon: Sparkles,
                title: "Pattern Recognition",
                description: "AI-powered analysis reveals hidden patterns in your data streams"
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Monitor data flows and trends as they happen in real-time"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/70 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-foreground/60">
            © 2024 DataFlow. Illuminating the data universe.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ConstellationLanding;