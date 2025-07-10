import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';

const PremiumShowcase: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="showcase" className="py-32 px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              See It In Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Watch how our platform transforms the way teams collaborate and individuals 
            organize their thoughts with intelligent, intuitive design.
          </p>
        </motion.div>

        {/* Main Demo Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 group hover:shadow-[var(--shadow-premium)] transition-all duration-700">
            <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              {/* Placeholder for demo video */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 group-hover:shadow-2xl transition-all duration-300"
                >
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </Button>
                <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
              </motion.div>
              
              {/* Demo overlay text */}
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Interactive Demo</h3>
                <p className="text-white/80">3-minute overview of key features</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Device Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {[
            {
              icon: Monitor,
              title: "Desktop Experience",
              description: "Full-featured interface with advanced editing tools and multi-panel layouts",
              image: "desktop-demo"
            },
            {
              icon: Tablet,
              title: "Tablet Optimized",
              description: "Touch-friendly interface perfect for reading, annotating, and quick edits",
              image: "tablet-demo"
            },
            {
              icon: Smartphone,
              title: "Mobile Ready",
              description: "Capture ideas on the go with voice notes and instant sync",
              image: "mobile-demo"
            }
          ].map((device, index) => {
            const Icon = device.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <Icon className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">{device.title}</h3>
                  </div>
                  
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">
                      {device.image} preview
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {device.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-3xl font-display font-bold mb-6">
              Real-time Collaboration
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              See how teams work together seamlessly with live cursors, 
              instant comments, and conflict-free editing that keeps everyone in sync.
            </p>
            
            <div className="space-y-4">
              {[
                "Live cursors and selections",
                "Instant commenting and replies",
                "Version history and branching",
                "Permission-based sharing"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground">
                  Collaboration Demo
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumShowcase;