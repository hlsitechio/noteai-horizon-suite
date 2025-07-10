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

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI that learns from your writing patterns and suggests intelligent improvements, auto-completes thoughts, and enhances clarity.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Instant search, real-time collaboration, and zero-latency editing. Experience the speed of thought with our optimized infrastructure.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption, zero-knowledge architecture, and compliance with GDPR, SOC 2, and ISO 27001 standards.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Cloud,
      title: "Universal Sync",
      description: "Seamless synchronization across all devices with offline support. Your notes are always available, everywhere you go.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: Search,
      title: "Intelligent Search",
      description: "Find anything instantly with AI-powered semantic search that understands context, not just keywords.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaboration with team permissions, commenting, and version history. Work together seamlessly.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Palette,
      title: "Infinite Customization",
      description: "Personalize every aspect of your experience with themes, layouts, and workflows that adapt to your unique style.",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Excellence",
      description: "Native mobile apps with full feature parity. Capture ideas on the go with voice notes and instant synchronization.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Edge computing and global CDN ensure optimal performance worldwide. 99.9% uptime guaranteed.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data belongs to you. Zero tracking, no ads, and complete control over your information.",
      color: "from-gray-600 to-gray-800"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights into your productivity patterns with detailed analytics and personalized recommendations.",
      color: "from-orange-500 to-yellow-600"
    },
    {
      icon: Workflow,
      title: "Automation & Integrations",
      description: "Connect with 1000+ apps and automate your workflow with smart templates and custom integrations.",
      color: "from-violet-500 to-purple-600"
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
    <section id="features" className="py-32 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-display font-display font-black mb-6 tracking-tight">
            <span className="text-gradient-premium">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Experience the perfect blend of{' '}
            <span className="text-foreground font-medium">simplicity and power</span>{' '}
            with features designed to transform how you capture, organize, and evolve your ideas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="card-premium group border-animate hover-lift-premium">
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-premium group-hover:shadow-glow transition-all duration-slow animate-float-gentle`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-headline font-semibold mb-4 group-hover:text-primary transition-colors duration-base">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFeatures;