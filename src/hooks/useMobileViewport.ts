import { useEffect } from 'react';
import { OptimizedDOMUtils } from '@/utils/optimizedDOMUtils';

export const useMobileViewport = () => {
  useEffect(() => {
    const handleViewportChange = () => {
      // Use optimized DOM utils to set CSS custom property for mobile viewport height
      const vh = window.innerHeight * 0.01;
      OptimizedDOMUtils.setDocumentStyle('--mobile-vh', `${vh}px`);
    };

    // Set initial value
    handleViewportChange();

    // Listen for resize events (including when browser UI shows/hides)
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    // For iOS Safari, also listen for scroll events that might trigger UI changes
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleViewportChange();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Only add scroll listener on mobile
    if (window.innerWidth <= 768) {
      document.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('touchmove', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if (window.innerWidth <= 768) {
        document.removeEventListener('scroll', handleScroll);
        document.removeEventListener('touchmove', handleScroll);
      }
    };
  }, []);
};