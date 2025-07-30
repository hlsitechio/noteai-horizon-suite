
export const themeConfig = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  extend: {
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    fontSize: {
      '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
    },
    spacing: {
      '18': '4.5rem',
      '88': '22rem',
    },
    maxWidth: {
      '8xl': '88rem',
      '9xl': '96rem',
    },
    screens: {
      'xs': '475px',
    },
    backdropBlur: {
      'xs': '2px',
    },
    boxShadow: {
      'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      'large': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    transitionTimingFunction: {
      'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  }
};
