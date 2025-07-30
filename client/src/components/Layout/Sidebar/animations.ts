// Shared animation patterns for sidebar components
import { Variants } from 'framer-motion';

export const sidebarAnimations = {
  // Standard section expand/collapse animation
  sectionVariants: {
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.2, ease: 'easeOut' },
        opacity: { duration: 0.3, delay: 0.1 }
      }
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2, ease: 'easeIn' },
        opacity: { duration: 0.1 }
      }
    }
  } as Variants,

  // List item animation with stagger
  listItemVariants: {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.15,
        ease: 'easeIn'
      }
    }
  } as Variants,

  // Container animation for staggered children
  containerVariants: {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    hidden: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  } as Variants,

  // Sidebar slide animation
  sidebarVariants: {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  } as Variants,

  // Button hover animation
  buttonVariants: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.15, ease: 'easeOut' }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1, ease: 'easeIn' }
    }
  } as Variants,

  // Icon rotation for expand/collapse indicators
  iconVariants: {
    expanded: { rotate: 90, transition: { duration: 0.2 } },
    collapsed: { rotate: 0, transition: { duration: 0.2 } }
  } as Variants,

  // Fade in animation for content
  fadeInVariants: {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  } as Variants
};

// Animation timing constants
export const animationTimings = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  stagger: 0.05
} as const;

// Easing curves
export const easingCurves = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  sharp: 'cubic-bezier(0.4, 0, 1, 1)',
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
} as const;