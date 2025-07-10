import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PremiumNavigation from '../components/Landing/Premium/PremiumNavigation';
import PremiumHero from '../components/Landing/Premium/PremiumHero';
import PremiumFeatures from '../components/Landing/Premium/PremiumFeatures';
import PremiumShowcase from '../components/Landing/Premium/PremiumShowcase';
import PremiumTestimonials from '../components/Landing/Premium/PremiumTestimonials';
import PremiumPricing from '../components/Landing/Premium/PremiumPricing';
import PremiumCTA from '../components/Landing/Premium/PremiumCTA';
import PremiumFooter from '../components/Landing/Premium/PremiumFooter';
import { AnalyticsService } from '../services/analyticsService';

const PremiumLanding: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
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
      {/* Dynamic background with parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10"
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.1) 0%, transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      </motion.div>

      <PremiumNavigation mousePosition={mousePosition} />
      
      <motion.div style={{ y: heroY }}>
        <PremiumHero />
      </motion.div>
      
      <PremiumFeatures />
      <PremiumShowcase />
      <PremiumTestimonials />
      <PremiumPricing />
      <PremiumCTA />
      <PremiumFooter />
    </div>
  );
};

export default PremiumLanding;