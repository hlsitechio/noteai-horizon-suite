import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

const PremiumCTA: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      
      <div className="max-w-6xl mx-auto relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 p-12 lg:p-20 text-center">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-8">
                  <Sparkles className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Ready to Transform Your Productivity?</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    Start Your Journey Today
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join thousands of professionals who have already transformed their 
                  workflow with our AI-powered platform. Experience the future of productivity.
                </p>
              </motion.div>

              {/* Stats/Features Row */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              >
                {[
                  {
                    icon: Users,
                    title: "50K+ Users",
                    description: "Trusted by professionals worldwide"
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Secure",
                    description: "Military-grade encryption & compliance"
                  },
                  {
                    icon: Sparkles,
                    title: "AI-Powered",
                    description: "Next-generation intelligence"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground text-center">{item.description}</p>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
              >
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="px-12 py-6 text-lg bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-premium)] transform hover:scale-105 transition-all duration-300 group min-w-[280px]"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-12 py-6 text-lg border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 min-w-[280px]"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
                </p>
                <div className="inline-flex items-center space-x-6 opacity-60">
                  <span className="text-sm font-medium">SOC 2 Certified</span>
                  <span className="text-sm font-medium">GDPR Compliant</span>
                  <span className="text-sm font-medium">ISO 27001</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCTA;