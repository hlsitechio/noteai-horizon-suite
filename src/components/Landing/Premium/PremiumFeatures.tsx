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
      title: "Unmatched productivity",
      description: "Online Note AI is a comprehensive note-taking and knowledge management platform that provides amazing collaboration opportunities for students, professionals, and creative teams alike.",
      items: [
        { title: "AI Assistance", desc: "Work efficiently with intelligent auto-completion and suggestions." },
        { title: "Smart Organization", desc: "Keep track of your ideas by organizing notes in dynamic folders and tags." },
        { title: "Real-time Sync", desc: "Keep up to date with any changes by receiving instant synchronization across devices." },
        { title: "Collaborative Editing", desc: "Transform individual notes into collaborative workspaces for team productivity." }
      ]
    },
    {
      icon: Users,
      title: "Work together. Like in real life.",
      description: "Create customized collaborative spaces for any project or team with seamless real-time editing and high-quality sharing capabilities.",
      features: [
        { title: "Shared Workspaces", desc: "Create your own note collections and collaborative spaces to suit your team's needs.", icon: "🏢" },
        { title: "Real-time Collaboration", desc: "Edit documents simultaneously with team members with live cursor tracking.", icon: "🎥" },
        { title: "Comment System", desc: "Collaborate with team members without ever needing to leave your workspace.", icon: "💬" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {features.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`${sectionIndex > 0 ? 'mt-32' : ''}`}
          >
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-16">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary mr-4">
                  <section.icon className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {section.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {section.description}
              </p>
            </motion.div>

            {/* Feature Items */}
            {section.items && (
              <motion.div variants={containerVariants} className="space-y-8">
                {section.items.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-3"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Feature Cards */}
            {section.features && (
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.features.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="p-6 bg-card/50 border border-border/50 hover:border-primary/20 hover:bg-card/70 transition-all duration-300">
                      <div className="text-3xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PremiumFeatures;