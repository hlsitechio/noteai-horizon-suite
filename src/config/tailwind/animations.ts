
export const keyframesConfig = {
  'accordion-down': {
    from: {
      height: '0'
    },
    to: {
      height: 'var(--radix-accordion-content-height)'
    }
  },
  'accordion-up': {
    from: {
      height: 'var(--radix-accordion-content-height)'
    },
    to: {
      height: '0'
    }
  },
  'fade-in': {
    '0%': {
      opacity: '0',
      transform: 'translateY(10px)'
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0)'
    }
  },
  'fade-out': {
    '0%': {
      opacity: '1',
      transform: 'translateY(0)'
    },
    '100%': {
      opacity: '0',
      transform: 'translateY(10px)'
    }
  },
  'scale-in': {
    '0%': {
      transform: 'scale(0.95)',
      opacity: '0'
    },
    '100%': {
      transform: 'scale(1)',
      opacity: '1'
    }
  },
  'scale-out': {
    '0%': { 
      transform: 'scale(1)', 
      opacity: '1' 
    },
    '100%': { 
      transform: 'scale(0.95)', 
      opacity: '0' 
    }
  },
  'slide-in-right': {
    '0%': { 
      transform: 'translateX(100%)' 
    },
    '100%': { 
      transform: 'translateX(0)' 
    }
  },
  'slide-out-right': {
    '0%': { 
      transform: 'translateX(0)' 
    },
    '100%': { 
      transform: 'translateX(100%)' 
    }
  },
  'shimmer': {
    '0%': {
      backgroundPosition: '-200% 0'
    },
    '100%': {
      backgroundPosition: '200% 0'
    }
  },
  'pulse-soft': {
    '0%, 100%': {
      opacity: '1'
    },
    '50%': {
      opacity: '0.8'
    }
  },
  'slide-in-from-left': {
    '0%': {
      transform: 'translateX(-100%)',
      opacity: '0'
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: '1'
    }
  },
  'fade-in-place': {
    '0%': {
      opacity: '0',
      transform: 'scale(0.95)'
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)'
    }
  }
};

export const animationConfig = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-out',
  'fade-out': 'fade-out 0.3s ease-out',
  'scale-in': 'scale-in 0.2s ease-out',
  'scale-out': 'scale-out 0.2s ease-out',
  'slide-in-right': 'slide-in-right 0.3s ease-out',
  'slide-out-right': 'slide-out-right 0.3s ease-out',
  'shimmer': 'shimmer 2s linear infinite',
  'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'slide-in-from-left': 'slide-in-from-left 0.4s ease-out',
  'fade-in-place': 'fade-in-place 0.3s ease-out',
};
