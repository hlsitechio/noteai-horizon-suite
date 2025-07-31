import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components for better performance
const ContentHub = lazy(() => import('@/components/Marketing/ContentHub'));
const SocialProof = lazy(() => import('@/components/Marketing/SocialProof'));
const Pricing = lazy(() => import('@/components/Landing/Pricing'));

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({ 
  children, 
  fallback,
  className = '' 
}) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 text-muted-foreground"
      >
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading...</span>
      </motion.div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Performance-optimized components with lazy loading
export const LazyContentHub = () => (
  <LazyComponentWrapper>
    <ContentHub />
  </LazyComponentWrapper>
);

export const LazySocialProof = ({ variant, className }: { variant?: any, className?: string }) => (
  <LazyComponentWrapper className={className}>
    <SocialProof variant={variant} className={className} />
  </LazyComponentWrapper>
);

export const LazyPricing = () => (
  <LazyComponentWrapper>
    <Pricing />
  </LazyComponentWrapper>
);

export default LazyComponentWrapper;