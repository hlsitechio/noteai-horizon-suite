
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Landing/Navigation';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import Footer from '../components/Landing/Footer';
import PageAICopilot from '../components/Global/PageAICopilot';

const Landing: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isScrolled={isScrolled} mousePosition={mousePosition} />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
      <PageAICopilot pageContext="landing" />
    </div>
  );
};

export default Landing;
