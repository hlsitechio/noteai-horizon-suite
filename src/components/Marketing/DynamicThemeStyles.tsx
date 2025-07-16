import React from 'react';
import { useLandingTheme } from '@/contexts/LandingThemeContext';

export const DynamicThemeStyles: React.FC = () => {
  const { currentTheme } = useLandingTheme();

  return (
    <style>{`
      /* ========================================
         COMPLETE WEBSITE THEME TRANSFORMATION
         ======================================== */

      /* Global Background Gradient */
      .min-h-screen {
        background: ${currentTheme.backgroundGradient};
        transition: background 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Font Family Overrides */
      h1, h2, h3, h4, h5, h6 {
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
        transition: font-family 0.3s ease;
      }

      body, p, span, div {
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
        transition: font-family 0.3s ease;
      }

      code, pre, .font-mono {
        font-family: ${currentTheme.fonts.mono}, monospace !important;
      }

      /* ========================================
         NAVIGATION THEMING
         ======================================== */
      .nav-accent, .navigation-brand {
        color: hsl(${currentTheme.colors.primary}) !important;
        transition: color 0.6s ease;
      }

      .nav-link:hover {
        color: hsl(${currentTheme.colors.accent}) !important;
      }

      /* ========================================
         HERO SECTION THEMING
         ======================================== */
      .hero-gradient, .whimsical-hero-bg {
        background: ${currentTheme.gradient} !important;
        opacity: 0.15;
        transition: background 0.8s ease;
      }

      .hero-title {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.accent})) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }

      .hero-accent {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      /* ========================================
         BUTTON THEMING
         ======================================== */
      .btn-primary, .btn-primary-themed, .button-primary {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
        border: none !important;
        color: white !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .btn-primary:hover, .btn-primary-themed:hover, .button-primary:hover {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.9), hsl(${currentTheme.colors.secondary} / 0.9)) !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px hsl(${currentTheme.colors.primary} / 0.4) !important;
      }

      .btn-secondary {
        border-color: hsl(${currentTheme.colors.primary}) !important;
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .btn-secondary:hover {
        background: hsl(${currentTheme.colors.primary}) !important;
        color: white !important;
      }

      /* ========================================
         FEATURE CARDS THEMING
         ======================================== */
      .feature-card, .feature-card-accent {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.05), hsl(${currentTheme.colors.accent} / 0.05)) !important;
        border-color: hsl(${currentTheme.colors.primary} / 0.15) !important;
        transition: all 0.6s ease;
      }

      .feature-card:hover {
        border-color: hsl(${currentTheme.colors.primary} / 0.3) !important;
        box-shadow: 0 10px 30px hsl(${currentTheme.colors.primary} / 0.15) !important;
      }

      .feature-icon {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .feature-title {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      /* ========================================
         PRICING SECTION THEMING
         ======================================== */
      .pricing-card-featured {
        border-color: hsl(${currentTheme.colors.primary}) !important;
        box-shadow: 0 0 40px hsl(${currentTheme.colors.primary} / 0.2) !important;
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.03), hsl(${currentTheme.colors.accent} / 0.03)) !important;
      }

      .pricing-highlight {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
        color: white !important;
      }

      .pricing-accent {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      /* ========================================
         SOCIAL PROOF THEMING
         ======================================== */
      .social-proof-accent, .testimonial-accent {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .testimonial-card:hover {
        border-color: hsl(${currentTheme.colors.primary} / 0.2) !important;
        box-shadow: 0 8px 25px hsl(${currentTheme.colors.primary} / 0.1) !important;
      }

      .rating-star {
        color: hsl(${currentTheme.colors.secondary}) !important;
      }

      /* ========================================
         FOOTER THEMING
         ======================================== */
      .footer-accent, .footer-link:hover {
        color: hsl(${currentTheme.colors.accent}) !important;
      }

      .footer-separator {
        background: linear-gradient(90deg, transparent, hsl(${currentTheme.colors.primary} / 0.3), transparent) !important;
      }

      /* ========================================
         FORM ELEMENTS THEMING
         ======================================== */
      .form-input:focus {
        border-color: hsl(${currentTheme.colors.primary}) !important;
        box-shadow: 0 0 0 3px hsl(${currentTheme.colors.primary} / 0.1) !important;
      }

      .form-accent {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      /* ========================================
         ACCENT ELEMENTS
         ======================================== */
      .accent-primary {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .accent-secondary {
        color: hsl(${currentTheme.colors.secondary}) !important;
      }

      .accent-gradient {
        background: ${currentTheme.gradient} !important;
      }

      .border-accent {
        border-color: hsl(${currentTheme.colors.primary}) !important;
      }

      .glow-effect {
        box-shadow: 0 0 30px hsl(${currentTheme.colors.primary} / 0.3) !important;
      }

      /* ========================================
         LOADING STATES
         ======================================== */
      .loading-spinner {
        border-top-color: hsl(${currentTheme.colors.primary}) !important;
      }

      .progress-bar {
        background: linear-gradient(90deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
      }

      /* ========================================
         INTERACTIVE ELEMENTS
         ======================================== */
      .hover-accent:hover {
        color: hsl(${currentTheme.colors.primary}) !important;
        transform: translateY(-1px);
      }

      .link-underline::after {
        background: hsl(${currentTheme.colors.primary}) !important;
      }

      /* ========================================
         ANIMATIONS & TRANSITIONS
         ======================================== */
      .pulse-accent {
        animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse-custom {
        0%, 100% {
          box-shadow: 0 0 20px hsl(${currentTheme.colors.primary} / 0.4);
        }
        50% {
          box-shadow: 0 0 40px hsl(${currentTheme.colors.primary} / 0.8);
        }
      }

      /* ========================================
         RESPONSIVE GLOW EFFECTS
         ======================================== */
      @media (min-width: 768px) {
        .desktop-glow {
          filter: drop-shadow(0 0 20px hsl(${currentTheme.colors.primary} / 0.3));
        }
      }

      /* ========================================
         SMOOTH TRANSITIONS FOR ALL ELEMENTS
         ======================================== */
      * {
        transition: 
          color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          background 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          font-family 0.3s ease;
      }
    `}</style>
  );
};