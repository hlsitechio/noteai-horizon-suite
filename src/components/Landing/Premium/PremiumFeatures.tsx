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
import FloatingCard3D from './FloatingCard3D';
import HolographicText from './HolographicText';
import CyberpunkCard from './CyberpunkCard';
import ScrollLighting from './ScrollLighting';

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
    <ScrollLighting intensity={1.5}>
      <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto" ref={ref}>
          {features.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={`${sectionIndex > 0 ? 'mt-40' : ''}`}
            >
              {/* Revolutionary Section Header */}
              <FloatingCard3D 
                depth={30} 
                glowIntensity={0.8}
                className="mb-20"
              >
                <motion.div variants={itemVariants} className="p-12 text-center">
                  <div className="flex items-center justify-center mb-8">
                    <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl text-primary mr-6 neural-float">
                      <section.icon className="w-12 h-12" />
                    </div>
                  </div>
                  <HolographicText 
                    className="text-5xl md:text-6xl font-neural font-black mb-8"
                    glitchEffect={true}
                  >
                    {section.title}
                  </HolographicText>
                  <p className="text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed font-cyber">
                    {section.description}
                  </p>
                </motion.div>
              </FloatingCard3D>

              {/* Neural Feature Items */}
              {section.items && (
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                  {section.items.map((item, index) => (
                    <FloatingCard3D
                      key={index}
                      depth={25}
                      glowIntensity={0.6}
                      className="group"
                    >
                      <CyberpunkCard variant="neural" className="p-8 h-full">
                        <motion.div
                          variants={itemVariants}
                          className="flex items-start space-x-6"
                        >
                          <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full mt-2 neural-pulse"></div>
                          <div>
                            <HolographicText className="text-2xl font-neural font-bold mb-4 group-hover:text-neural-glow transition-all duration-500">
                              {item.title}
                            </HolographicText>
                            <p className="text-foreground/70 font-cyber leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </motion.div>
                      </CyberpunkCard>
                    </FloatingCard3D>
                  ))}
                </motion.div>
              )}

              {/* Advanced Feature Cards */}
              {section.features && (
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {section.features.map((feature, index) => (
                    <FloatingCard3D
                      key={index}
                      depth={35}
                      glowIntensity={0.7}
                    >
                      <CyberpunkCard variant="holographic" className="p-8 h-full hover-neural">
                        <motion.div variants={itemVariants} className="text-center">
                          <div className="text-6xl mb-6 neural-float">{feature.icon}</div>
                          <HolographicText className="text-xl font-neural font-bold mb-4">
                            {feature.title}
                          </HolographicText>
                          <p className="text-foreground/70 font-cyber leading-relaxed">
                            {feature.desc}
                          </p>
                        </motion.div>
                      </CyberpunkCard>
                    </FloatingCard3D>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </ScrollLighting>
  );
};

export default PremiumFeatures;