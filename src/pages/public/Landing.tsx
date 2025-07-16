
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Landing/Navigation';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import WhimsicalHero from '@/components/Landing/WhimsicalHero';
import WhimsicalFeatures from '@/components/Landing/WhimsicalFeatures';
import Pricing from '@/components/Landing/Pricing';
import Footer from '@/components/Landing/Footer';
import EnhancedSecurityHeaders from '@/components/Security/EnhancedSecurityHeaders';
import NewsletterSignup from '@/components/Marketing/NewsletterSignup';
import SocialProof from '@/components/Marketing/SocialProof';
import MarketingCTA from '@/components/Marketing/MarketingCTA';
import SEOOptimizer from '@/components/Marketing/SEOOptimizer';
import ContentHub from '@/components/Marketing/ContentHub';
import TrustSignals from '@/components/Marketing/TrustSignals';
import LeadCapturePopup from '@/components/Marketing/LeadCapturePopup';
import MobileOptimizedCTA from '@/components/Mobile/MobileOptimizedCTA';
import { LazyContentHub, LazySocialProof, LazyPricing } from '@/components/Performance/LazyComponents';
import { useExitIntent, useScrollDepth, useTimeOnPage } from '@/hooks/useConversionTracking';
import { usePerformanceTracking, useViewportTracking } from '@/hooks/usePerformanceOptimization';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';

import { AnalyticsService } from '@/services/analyticsService';

const Landing: React.FC = () => {
  // Ensure clean theme for public landing page
  usePublicPageTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showMobileCTA, setShowMobileCTA] = useState(true);

  // Performance and viewport tracking
  const performanceMetrics = usePerformanceTracking();
  const viewport = useViewportTracking();

  // Advanced conversion tracking
  useExitIntent({
    onExitIntent: () => setShowLeadCapture(true),
    enabled: !showLeadCapture
  });

  useScrollDepth({
    onScrollDepth: (depth) => {
      if (depth === 75 && !showLeadCapture) {
        // Show popup after significant scroll engagement
        setTimeout(() => setShowLeadCapture(true), 2000);
      }
    }
  });

  useTimeOnPage({
    onTimeThreshold: (seconds) => {
      if (seconds === 120 && !showLeadCapture) {
        // Show popup after 2 minutes of engagement
        setShowLeadCapture(true);
      }
    }
  });

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
        title="OnlineNote.ai - AI-Powered Note-Taking That Actually Works | Smart Productivity Tools"
        description="Join 50,000+ professionals using OnlineNote.ai's intelligent note-taking system. AI-powered organization, instant search, real-time collaboration, and automated insights that transform how you capture and manage knowledge."
        keywords={['ai note taking app', 'smart note organization', 'ai productivity tools', 'intelligent note system', 'collaborative note taking', 'ai writing assistant', 'knowledge management ai', 'digital note taking', 'ai powered notes', 'smart productivity app']}
        canonicalUrl="https://onlinenote.ai"
      />
      <EnhancedSecurityHeaders />
      <div 
        className="min-h-screen bg-background relative overflow-hidden particle-bg"
        onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
      >
        {/* Whimsical-inspired background */}
        <div className="absolute inset-0 whimsical-gradient-radial" />
        
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 transition-transform duration-1000"
          style={{ 
            background: `radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, hsl(var(--gradient-accent) / 0.3) 0%, transparent 50%)`,
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)` 
          }}
        />
        
        <Navigation isScrolled={isScrolled} mousePosition={mousePosition} />
        <WhimsicalHero />
        <WhimsicalFeatures />
        
        {/* Social Proof Section */}
        <LazySocialProof variant="logos" className="py-12" />
        
        <LazyPricing />
        
        {/* Newsletter Signup */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup variant="inline" />
          </div>
        </section>
        
        {/* Trust Signals */}
        <TrustSignals variant="compact" className="py-8" />
        
        <Footer />
      </div>
      
      {/* Advanced Lead Capture Popup */}
      <AnimatePresence>
        <LeadCapturePopup 
          isOpen={showLeadCapture}
          onClose={() => setShowLeadCapture(false)}
          trigger="exit_intent"
        />
      </AnimatePresence>
      
      {/* Mobile Optimized CTA */}
      <MobileOptimizedCTA 
        isVisible={showMobileCTA && viewport.deviceType !== 'desktop'}
        onClose={() => setShowMobileCTA(false)}
      />
    </>
  );
};

export default Landing;
