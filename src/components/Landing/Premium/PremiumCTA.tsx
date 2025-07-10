import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import FloatingCard3D from './FloatingCard3D';
import HolographicText from './HolographicText';
import CyberpunkCard from './CyberpunkCard';
import ScrollLighting from './ScrollLighting';

const PremiumCTA: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <ScrollLighting intensity={2}>
      <section className="py-40 px-6 lg:px-8 relative overflow-hidden">
        {/* Advanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-neural-mesh opacity-30" />
        
        <div className="max-w-6xl mx-auto relative" ref={ref}>
          <FloatingCard3D 
            depth={50} 
            glowIntensity={1.2}
            className="w-full"
          >
            <CyberpunkCard variant="holographic" className="p-16 lg:p-24 text-center hover-neural">
              {/* Floating elements */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-16"
              >
                <div className="inline-flex items-center bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-8 py-4 mb-12 neural-float">
                  <Sparkles className="w-6 h-6 text-primary mr-3 neural-pulse" />
                  <span className="text-lg font-neural font-bold">TRANSCEND INTO THE NEURAL REALM</span>
                </div>
                
                <HolographicText 
                  className="text-6xl md:text-7xl lg:text-8xl font-neural font-black mb-8 leading-tight"
                  glitchEffect={true}
                >
                  <span className="block">JOIN THE</span>
                  <span className="block text-neural-glow">REVOLUTION</span>
                </HolographicText>
                
                <p className="text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed font-cyber">
                  Step into the future of{' '}
                  <span className="text-holographic font-neural font-bold">neural productivity</span>{' '}
                  where your thoughts become reality through AI-powered intelligence.
                </p>
              </motion.div>

              {/* Stats/Features Row */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
              >
                {[
                  {
                    icon: Users,
                    title: "100K+ Neural Minds",
                    description: "Connected across the digital realm"
                  },
                  {
                    icon: Shield,
                    title: "Quantum Encrypted",
                    description: "Military-grade neural protection"
                  },
                  {
                    icon: Sparkles,
                    title: "AI Singularity Ready",
                    description: "Next-generation consciousness interface"
                  }
                ].map((item, index) => (
                  <FloatingCard3D key={index} depth={25} glowIntensity={0.8}>
                    <div className="flex flex-col items-center p-8">
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 mb-6 neural-rotate">
                        <item.icon className="w-10 h-10 text-primary" />
                      </div>
                      <HolographicText className="text-xl font-neural font-bold mb-3">{item.title}</HolographicText>
                      <p className="text-foreground/70 text-center font-cyber">{item.description}</p>
                    </div>
                  </FloatingCard3D>
                ))}
              </motion.div>

              {/* Revolutionary CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12"
              >
                <Link to="/register">
                  <FloatingCard3D depth={20} glowIntensity={1}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-16 py-8 text-xl font-neural font-bold rounded-2xl hover:shadow-glow transition-all duration-500 neural-float group"
                    >
                      ENTER THE MATRIX
                      <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </FloatingCard3D>
                </Link>
                
                <Link to="/contact">
                  <FloatingCard3D depth={15} glowIntensity={0.8}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-primary/50 text-primary px-16 py-8 text-xl font-neural font-bold rounded-2xl hover:bg-primary/10 hover:border-primary transition-all duration-500 neural-float"
                    >
                      REQUEST NEURAL ACCESS
                    </Button>
                  </FloatingCard3D>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-lg text-foreground/60 mb-6 font-cyber">
                  ✓ Instant Neural Integration • ✓ No Credit Card Required • ✓ Quantum Security Guaranteed
                </p>
                <div className="inline-flex items-center space-x-8 opacity-70">
                  <span className="text-sm font-neural font-bold">NEURAL CERTIFIED</span>
                  <span className="text-sm font-neural font-bold">QUANTUM COMPLIANT</span>
                  <span className="text-sm font-neural font-bold">AI SINGULARITY READY</span>
                </div>
              </motion.div>
            </CyberpunkCard>
          </FloatingCard3D>
        </div>
      </section>
    </ScrollLighting>
  );
};

export default PremiumCTA;