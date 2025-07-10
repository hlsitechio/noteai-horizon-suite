import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import HolographicText from './HolographicText';
import FloatingCard3D from './FloatingCard3D';

interface PremiumNavigationProps {
  mousePosition: { x: number; y: number };
}

const PremiumNavigation: React.FC<PremiumNavigationProps> = ({ mousePosition }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' }
  ];

  return (
    <>
      {/* Neural dynamic background effect */}
      <div 
        className="fixed top-0 left-0 w-full h-40 pointer-events-none z-40"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px 0px, 
            hsl(280 100% 70% / 0.08) 0%, 
            hsl(195 100% 50% / 0.05) 30%, 
            transparent 60%)`
        }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-glow'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Revolutionary Logo */}
            <FloatingCard3D depth={10} glowIntensity={0.5}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-4 p-3 rounded-2xl"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 neural-pulse">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <HolographicText className="text-2xl font-neural font-black">
                  NEURAL AI
                </HolographicText>
              </motion.div>
            </FloatingCard3D>

            {/* Cyberpunk Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative group font-neural font-bold text-foreground/80 hover:text-primary transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
            </div>

            {/* Neural Action Buttons */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary font-neural font-bold hover:bg-primary/10 neural-float"
                >
                  Neural Login
                </Button>
              </Link>
              <Link to="/register">
                <FloatingCard3D depth={8} glowIntensity={0.8}>
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-neural font-bold px-8 py-3 rounded-xl hover:shadow-glow transition-all duration-300 group neural-float"
                  >
                    Join Matrix
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </FloatingCard3D>
              </Link>
            </div>

            {/* Neural mobile menu button */}
            <FloatingCard3D depth={5} glowIntensity={0.6}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 rounded-xl hover:bg-primary/10 transition-colors neural-pulse"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-primary" />
                ) : (
                  <Menu className="w-6 h-6 text-primary" />
                )}
              </button>
            </FloatingCard3D>
          </div>
        </nav>

        {/* Revolutionary Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-primary/20"
            >
              <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="block text-foreground/80 hover:text-primary py-3 font-neural font-bold text-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <div className="pt-6 space-y-4">
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full font-neural font-bold">
                      Neural Login
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-neural font-bold">
                      Join Matrix
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default PremiumNavigation;