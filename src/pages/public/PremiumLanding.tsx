import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PremiumNavigation from '@/components/Landing/Premium/PremiumNavigation';
import PremiumHero from '@/components/Landing/Premium/PremiumHero';
import PremiumFeatures from '@/components/Landing/Premium/PremiumFeatures';
import PremiumShowcase from '@/components/Landing/Premium/PremiumShowcase';
import PremiumTestimonials from '@/components/Landing/Premium/PremiumTestimonials';
import PremiumPricing from '@/components/Landing/Premium/PremiumPricing';
import PremiumCTA from '@/components/Landing/Premium/PremiumCTA';
import PremiumFooter from '@/components/Landing/Premium/PremiumFooter';
import PremiumBackground from '@/components/Landing/Premium/PremiumBackground';
import { AnalyticsService } from '@/services/analyticsService';

const PremiumLanding: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY, scrollYProgress } = useScroll();
  
  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -300]);
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    // Track premium page view
    AnalyticsService.trackPageView('/landing.2', 'Premium Landing Page');

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Track engagement
    const handleScroll = () => {
      if (window.scrollY > 100) {
        AnalyticsService.trackUserAction('premium_scroll_engagement', 'landing_premium');
      }
    };

    window.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Revolutionary Quantum Aurora Background */}
      <PremiumBackground 
        mousePosition={mousePosition} 
        scrollProgress={scrollYProgress.get()}
      />
      
      {/* Neural-enhanced Navigation */}
      <PremiumNavigation mousePosition={mousePosition} />
      
      {/* Neural Mind Palace Hero */}
      <motion.div 
        style={{ y: heroY }}
        className="relative z-10"
      >
        <PremiumHero />
      </motion.div>
      
      {/* Revolutionary Features */}
      <div className="relative z-10">
        <PremiumFeatures />
        <PremiumShowcase />
        <PremiumTestimonials />
        <PremiumPricing />
        <PremiumCTA />
        <PremiumFooter />
      </div>
      
      {/* Additional neural effects overlay */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl neural-float opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl neural-float opacity-40" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl neural-float opacity-20"
             style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );
};

export default PremiumLanding;