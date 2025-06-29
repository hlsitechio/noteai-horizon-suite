import React, { useState, useEffect } from 'react';
import Navigation from '../components/Landing/Navigation';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import Footer from '../components/Landing/Footer';
import { AnalyticsService } from '../services/analyticsService';

const Landing: React.FC = () => {
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
      <div className="min-h-screen bg-background">
        <Navigation isScrolled={isScrolled} mousePosition={mousePosition} />
        <Hero />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
