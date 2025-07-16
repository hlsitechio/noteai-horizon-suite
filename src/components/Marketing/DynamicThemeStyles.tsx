import React from 'react';
import { useLandingTheme } from '@/contexts/LandingThemeContext';

export const DynamicThemeStyles: React.FC = () => {
  const { currentTheme } = useLandingTheme();

  return (
    <style>{`
      /* Dynamic theme styles that affect landing page components */
      .landing-themed-bg {
        background: ${currentTheme.gradient};
      }
      
      .landing-themed-text {
        color: hsl(${currentTheme.colors.primary});
      }
      
      .landing-themed-accent {
        color: hsl(${currentTheme.colors.accent});
      }
      
      .landing-themed-button {
        ${currentTheme.buttonStyle.replace('bg-gradient-to-r from-', 'background: linear-gradient(to right, ')}
      }
      
      .landing-themed-border {
        border-color: hsl(${currentTheme.colors.primary});
      }
      
      .landing-themed-glow {
        box-shadow: 0 0 20px hsl(${currentTheme.colors.primary} / 0.3);
      }

      /* Update WhimsicalHero background */
      .whimsical-hero-bg {
        background: ${currentTheme.gradient};
        opacity: 0.1;
      }

      /* Update feature cards accent colors */
      .feature-card-accent {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.1), hsl(${currentTheme.colors.accent} / 0.1));
        border-color: hsl(${currentTheme.colors.primary} / 0.2);
      }

      /* Update navigation accent */
      .nav-accent {
        color: hsl(${currentTheme.colors.primary});
      }

      /* Update button styles site-wide for landing */
      .btn-primary-themed {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary}));
        border: none;
        color: white;
      }

      .btn-primary-themed:hover {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.9), hsl(${currentTheme.colors.secondary} / 0.9));
        transform: translateY(-1px);
        box-shadow: 0 4px 12px hsl(${currentTheme.colors.primary} / 0.4);
      }

      /* Update pricing card accents */
      .pricing-card-featured {
        border-color: hsl(${currentTheme.colors.primary});
        box-shadow: 0 0 30px hsl(${currentTheme.colors.primary} / 0.2);
      }

      /* Update social proof section */
      .social-proof-accent {
        color: hsl(${currentTheme.colors.primary});
      }

      /* Update footer accents */
      .footer-accent {
        color: hsl(${currentTheme.colors.accent});
      }
    `}</style>
  );
};