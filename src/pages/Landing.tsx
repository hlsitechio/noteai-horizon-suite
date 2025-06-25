
import React from 'react';
import Navigation from '../components/Landing/Navigation';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import Pricing from '../components/Landing/Pricing';
import Footer from '../components/Landing/Footer';
import PageAICopilot from '../components/Global/PageAICopilot';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isScrolled={false} mousePosition={{ x: 0, y: 0 }} />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
      <PageAICopilot pageContext="landing" />
    </div>
  );
};

export default Landing;
