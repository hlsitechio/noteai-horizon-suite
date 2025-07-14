
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Landing/Navigation';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import Pricing from '@/components/Landing/Pricing';
import Footer from '@/components/Landing/Footer';
import EnhancedSecurityHeaders from '@/components/Security/EnhancedSecurityHeaders';
import NewsletterSignup from '@/components/Marketing/NewsletterSignup';
import SocialProof from '@/components/Marketing/SocialProof';
import MarketingCTA from '@/components/Marketing/MarketingCTA';
import SEOOptimizer from '@/components/Marketing/SEOOptimizer';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';

import { AnalyticsService } from '@/services/analyticsService';

const Landing: React.FC = () => {
  // Ensure clean theme for public landing page
  usePublicPageTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Track page view
    AnalyticsService.trackPageView('/landing', 'Landing Page');

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      
      // Track scroll engagement
      if (scrolled && !isScrolled) {
        AnalyticsService.trackUserAction('scroll_engagement', 'landing_page');
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Track user engagement
    const handleUserInteraction = () => {
      AnalyticsService.trackUserAction('page_interaction', 'landing_page');
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Track page load time
    if (window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      AnalyticsService.trackEvent('page_load_time', {
        page: 'landing',
        load_time: loadTime,
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isScrolled]);

  return (
    <>
      <SEOOptimizer 
        title="Online Note AI - Smart Note-Taking with AI"
        description="Transform your productivity with AI-powered note-taking. Organize, search, and collaborate smarter with intelligent suggestions and automated insights."
        keywords={['ai notes', 'smart note taking', 'productivity', 'ai assistant', 'note organization', 'collaboration']}
      />
      <EnhancedSecurityHeaders />
      <div className="min-h-screen bg-background">
        <Navigation isScrolled={isScrolled} mousePosition={mousePosition} />
        <Hero />
        
        {/* Social Proof Section */}
        <SocialProof variant="logos" className="py-12" />
        
        <Features />
        
        {/* Testimonials */}
        <SocialProof variant="testimonials" />
        
        {/* Newsletter Signup */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup variant="inline" />
          </div>
        </section>
        
        {/* Stats */}
        <SocialProof variant="stats" />
        
        <Pricing />
        
        {/* Marketing CTA */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <MarketingCTA variant="primary" size="lg" placement="landing_page" />
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Landing;
