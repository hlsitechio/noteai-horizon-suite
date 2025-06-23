
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navigation from '@/components/Landing/Navigation';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import Pricing from '@/components/Landing/Pricing';
import Contact from '@/components/Landing/Contact';
import Footer from '@/components/Landing/Footer';
import { CursorProvider } from '../contexts/CursorContext';
import CustomCursor from '../components/CustomCursor/CustomCursor';
import CursorInteractionHandlers from '../components/CustomCursor/CursorInteractionHandlers';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 400);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CursorProvider>
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        <Navigation isScrolled={isScrolled} mousePosition={mousePosition} />
        <Hero />
        <Features />
        <Pricing />
        <Contact />
        <Footer />

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110 z-50 border border-white/20"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <CustomCursor />
        <CursorInteractionHandlers />
      </div>
    </CursorProvider>
  );
};

export default Landing;
