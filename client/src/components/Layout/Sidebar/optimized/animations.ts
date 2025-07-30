import { Variants } from 'framer-motion';

// Optimized animation variants with better performance
export const sidebarAnimations = {
  container: {
    expanded: {
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    collapsed: {
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  } as Variants,

  content: {
    expanded: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    collapsed: {
      opacity: 0.8,
      y: -2,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  } as Variants,

  item: {
    expanded: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    collapsed: {
      opacity: 0.9,
      x: -5,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  } as Variants,

  list: {
    expanded: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    },
    collapsed: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  } as Variants
};

// Simple hover effects without variants
export const hoverProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};