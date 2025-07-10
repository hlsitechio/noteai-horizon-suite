import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Cloud, 
  Search, 
  Users, 
  Palette, 
  Smartphone,
  Globe,
  Lock,
  BarChart3,
  Workflow
} from 'lucide-react';
import { Card } from '../../ui/card';

const PremiumFeatures: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI that learns from your writing patterns and suggests intelligent improvements.",
      category: "Core"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Instant search, real-time collaboration, and zero-latency editing.",
      category: "Performance"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption, zero-knowledge architecture, and compliance standards.",
      category: "Security"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "AI-powered semantic search that understands context, not just keywords.",
      category: "Core"
    }
  ];

  const secondaryFeatures = [
    {
      icon: Cloud,
      title: "Universal Sync",
      description: "Seamless synchronization across all devices with offline support."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaboration with permissions and version history."
    },
    {
      icon: Smartphone,
      title: "Mobile Excellence",
      description: "Native mobile apps with full feature parity."
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Edge computing and global CDN with 99.9% uptime."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Zero tracking, no ads, complete data control."
    },
    {
      icon: Workflow,
      title: "Automation",
      description: "Connect with 1000+ apps and automate workflows."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to capture, organize, and transform your ideas into action.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Main Feature - Spans 2x2 */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2">
            <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Brain className="w-8 h-8" />
                </div>
                <span className="ml-3 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Core
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                AI-Powered Intelligence
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Advanced AI that learns from your writing patterns and suggests intelligent improvements, auto-completes thoughts, and enhances clarity with contextual understanding.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Smart auto-completion
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Context-aware suggestions
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Writing pattern analysis
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Other main features */}
          {mainFeatures.slice(1).map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Secondary Features - Horizontal Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {secondaryFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-4 bg-card/30 backdrop-blur-sm border border-border/30 hover:bg-card/50 hover:border-border/50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFeatures;