
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigationScroll } from './Navigation/hooks/useNavigationScroll';
import DynamicBackground from './Navigation/DynamicBackground';
import NavigationLogo from './Navigation/NavigationLogo';
import NavigationItems from './Navigation/NavigationItems';
import NavigationActions from './Navigation/NavigationActions';
import MobileMenu from './Navigation/MobileMenu';

interface NavigationProps {
  isScrolled: boolean;
  mousePosition: { x: number; y: number };
}

const Navigation = ({ isScrolled, mousePosition }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isVisible } = useNavigationScroll();

  return (
    <>
      <DynamicBackground mousePosition={mousePosition} />

      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled 
                ? 'bg-black/80 backdrop-blur-2xl'
                : 'bg-transparent'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <NavigationLogo />
                <NavigationItems />
                <NavigationActions />

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <MobileMenu 
              isOpen={mobileMenuOpen} 
              onClose={() => setMobileMenuOpen(false)} 
            />
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
