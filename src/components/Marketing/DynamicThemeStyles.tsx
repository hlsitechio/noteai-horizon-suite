import React from 'react';
import { useLandingTheme } from '@/contexts/LandingThemeContext';

export const DynamicThemeStyles: React.FC = () => {
  const { currentTheme } = useLandingTheme();

  return (
    <style>{`
      /* ========================================
         COMPLETE WEBSITE THEME TRANSFORMATION
         ======================================== */

      /* Global Background Gradient - Complete Override */
      html, body, #root {
        background: ${currentTheme.backgroundGradient} !important;
        background-attachment: fixed !important;
        min-height: 100vh !important;
        transition: background 0.8s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* Force background gradient on main landing container */
      .particle-bg {
        background: ${currentTheme.backgroundGradient} !important;
        background-attachment: fixed !important;
      }

      /* Override all conflicting background classes */
      .bg-background, .min-h-screen, .landing-page, [class*="min-h-screen"] {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* Remove conflicting overlays that interfere with gradient */
      .whimsical-gradient-radial {
        background: transparent !important;
        opacity: 0 !important;
        display: none !important;
      }

      /* Override specific landing page background */
      div[class*="min-h-screen bg-background"] {
        background: ${currentTheme.backgroundGradient} !important;
        background-attachment: fixed !important;
      }

      /* Ensure all containers with background classes use theme gradient */
      div[class*="bg-background"] {
        background: ${currentTheme.backgroundGradient} !important;
        background-attachment: fixed !important;
      }

      /* ========================================
         COMPLETE WEBSITE COLOR TRANSFORMATION
         ======================================== */

      /* Override ALL text colors globally */
      h1, h2, h3, h4, h5, h6 {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      p, span, div, a {
        color: hsl(${currentTheme.colors.primary} / 0.8) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      /* Global text color adjustments */
      .text-foreground, .text-primary {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .text-muted-foreground, .text-secondary {
        color: hsl(${currentTheme.colors.primary} / 0.6) !important;
      }

      /* ========================================
         NAVIGATION COMPLETE THEMING
         ======================================== */
      nav, .navigation, header {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.1), hsl(${currentTheme.colors.accent} / 0.1)) !important;
        border-bottom: 1px solid hsl(${currentTheme.colors.primary} / 0.2) !important;
      }

      .nav-link, .navigation a {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      .nav-link:hover, .navigation a:hover {
        color: hsl(${currentTheme.colors.accent}) !important;
        text-shadow: 0 0 10px hsl(${currentTheme.colors.accent} / 0.5) !important;
      }

      /* ========================================
         HERO SECTION COMPLETE TRANSFORMATION
         ======================================== */
      .hero, .hero-section, .whimsical-hero {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.05), hsl(${currentTheme.colors.accent} / 0.05)) !important;
      }

      .hero h1, .hero-title, .hero h2 {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.accent})) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      .hero p, .hero-description {
        color: hsl(${currentTheme.colors.primary} / 0.7) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      /* ========================================
         BUTTON COMPLETE TRANSFORMATION
         ======================================== */
      button, .btn, [role="button"] {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
        color: white !important;
        border: 1px solid hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
        transition: all 0.3s ease !important;
      }

      button:hover, .btn:hover, [role="button"]:hover {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.9), hsl(${currentTheme.colors.secondary} / 0.9)) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px hsl(${currentTheme.colors.primary} / 0.4) !important;
      }

      /* Secondary buttons */
      .btn-secondary, .btn-outline {
        background: transparent !important;
        color: hsl(${currentTheme.colors.primary}) !important;
        border: 2px solid hsl(${currentTheme.colors.primary}) !important;
      }

      .btn-secondary:hover, .btn-outline:hover {
        background: hsl(${currentTheme.colors.primary}) !important;
        color: white !important;
      }

      /* ========================================
         CARD ELEMENTS TRANSFORMATION
         ======================================== */
      .card, .feature-card, [class*="card"] {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.03), hsl(${currentTheme.colors.accent} / 0.03)) !important;
        border: 1px solid hsl(${currentTheme.colors.primary} / 0.15) !important;
        backdrop-filter: blur(10px) !important;
      }

      .card:hover, .feature-card:hover {
        border-color: hsl(${currentTheme.colors.primary} / 0.3) !important;
        box-shadow: 0 10px 30px hsl(${currentTheme.colors.primary} / 0.15) !important;
        transform: translateY(-5px) !important;
      }

      .card h3, .card h4, .feature-title {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      .card p, .card span {
        color: hsl(${currentTheme.colors.primary} / 0.7) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      /* ========================================
         ICON TRANSFORMATION
         ======================================== */
      svg, .icon, [class*="icon"] {
        color: hsl(${currentTheme.colors.primary}) !important;
        fill: hsl(${currentTheme.colors.primary}) !important;
      }

      .feature-icon, .icon-primary {
        color: hsl(${currentTheme.colors.accent}) !important;
        filter: drop-shadow(0 0 10px hsl(${currentTheme.colors.accent} / 0.3)) !important;
      }

      /* ========================================
         FORM ELEMENTS TRANSFORMATION
         ======================================== */
      input, textarea, select {
        border: 2px solid hsl(${currentTheme.colors.primary} / 0.3) !important;
        background: hsl(${currentTheme.colors.primary} / 0.02) !important;
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      input:focus, textarea:focus, select:focus {
        border-color: hsl(${currentTheme.colors.primary}) !important;
        box-shadow: 0 0 0 3px hsl(${currentTheme.colors.primary} / 0.1) !important;
        outline: none !important;
      }

      label {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      /* ========================================
         PRICING SECTION TRANSFORMATION
         ======================================== */
      .pricing-card {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.03), hsl(${currentTheme.colors.accent} / 0.03)) !important;
        border: 1px solid hsl(${currentTheme.colors.primary} / 0.15) !important;
      }

      .pricing-card.featured, .pricing-card-featured {
        border-color: hsl(${currentTheme.colors.primary}) !important;
        box-shadow: 0 0 40px hsl(${currentTheme.colors.primary} / 0.2) !important;
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.05), hsl(${currentTheme.colors.accent} / 0.05)) !important;
      }

      .price, .pricing-amount {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      /* ========================================
         FOOTER TRANSFORMATION
         ======================================== */
      footer {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.05), hsl(${currentTheme.colors.accent} / 0.05)) !important;
        border-top: 1px solid hsl(${currentTheme.colors.primary} / 0.2) !important;
      }

      footer h3, footer h4 {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      footer p, footer a, footer span {
        color: hsl(${currentTheme.colors.primary} / 0.7) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      footer a:hover {
        color: hsl(${currentTheme.colors.accent}) !important;
        text-decoration: underline !important;
      }

      /* ========================================
         TESTIMONIALS TRANSFORMATION
         ======================================== */
      .testimonial, .testimonial-card {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary} / 0.03), hsl(${currentTheme.colors.accent} / 0.03)) !important;
        border: 1px solid hsl(${currentTheme.colors.primary} / 0.15) !important;
      }

      .testimonial:hover {
        border-color: hsl(${currentTheme.colors.primary} / 0.3) !important;
        box-shadow: 0 8px 25px hsl(${currentTheme.colors.primary} / 0.1) !important;
      }

      .testimonial-name {
        color: hsl(${currentTheme.colors.primary}) !important;
        font-family: ${currentTheme.fonts.heading}, sans-serif !important;
      }

      .testimonial-role, .testimonial-company {
        color: hsl(${currentTheme.colors.primary} / 0.6) !important;
        font-family: ${currentTheme.fonts.body}, sans-serif !important;
      }

      /* ========================================
         ACCENT ELEMENTS & HIGHLIGHTS
         ======================================== */
      .accent, .highlight, .primary-accent {
        color: hsl(${currentTheme.colors.primary}) !important;
      }

      .secondary-accent {
        color: hsl(${currentTheme.colors.secondary}) !important;
      }

      .gradient-accent {
        background: ${currentTheme.gradient} !important;
      }

      .border-accent {
        border-color: hsl(${currentTheme.colors.primary}) !important;
      }

      .glow-effect {
        box-shadow: 0 0 30px hsl(${currentTheme.colors.primary} / 0.3) !important;
      }

      /* ========================================
         LOADING & INTERACTIVE STATES
         ======================================== */
      .loading-spinner {
        border-top-color: hsl(${currentTheme.colors.primary}) !important;
      }

      .progress-bar {
        background: linear-gradient(90deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
      }

      .hover-accent:hover {
        color: hsl(${currentTheme.colors.primary}) !important;
        transform: translateY(-1px) !important;
      }

      /* ========================================
         SCROLLBAR THEMING
         ======================================== */
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, hsl(${currentTheme.colors.primary}), hsl(${currentTheme.colors.secondary})) !important;
      }

      ::-webkit-scrollbar-track {
        background: hsl(${currentTheme.colors.primary} / 0.1) !important;
      }

      /* ========================================
         FIX DISAPPEARING SECTIONS ON SCROLL
         ======================================== */
      section, .section {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        position: relative !important;
        z-index: 1 !important;
      }

      /* Prevent scroll animation conflicts */
      [data-scroll] {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* Fix for motion components */
      [data-projection-id] {
        opacity: 1 !important;
        will-change: auto !important;
      }

      /* ========================================
         SMOOTH TRANSITIONS FOR ALL ELEMENTS
         ======================================== */
      * {
        transition: 
          color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          font-family 0.3s ease;
      }
    `}</style>
  );
};