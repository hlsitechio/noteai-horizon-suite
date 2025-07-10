import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { safeSendAnalyticsEvent, trackMarketingConversion } from '@/utils/safeAnalytics';

interface MarketingCTAProps {
  variant?: 'primary' | 'secondary' | 'minimal' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  placement?: string;
}

const MarketingCTA: React.FC<MarketingCTAProps> = ({ 
  variant = 'primary',
  size = 'md',
  className = '',
  placement = 'default'
}) => {
  const handleCTAClick = (ctaType: string) => {
    safeSendAnalyticsEvent('marketing_cta_clicked', {
      variant,
      size,
      placement,
      cta_type: ctaType
    });

    trackMarketingConversion('cta_click');
  };

  const sizeClasses = {
    sm: 'py-8 px-6',
    md: 'py-12 px-8',
    lg: 'py-16 px-10'
  };

  const buttonSizes = {
    sm: 'default',
    md: 'lg',
    lg: 'lg'
  } as const;

  if (variant === 'primary') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl text-primary-foreground ${sizeClasses[size]} ${className}`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-6"
          >
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Note-Taking?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl lg:text-2xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            Join 50,000+ professionals who've already supercharged their productivity with AI-powered notes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button
                size={buttonSizes[size]}
                onClick={() => handleCTAClick('primary')}
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 h-auto text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button
                variant="outline"
                size={buttonSizes[size]}
                onClick={() => handleCTAClick('secondary')}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 h-auto text-lg"
              >
                View Pricing
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 flex items-center justify-center space-x-8 text-sm opacity-80"
          >
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Free for 14 days
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Setup in 2 minutes
            </div>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  if (variant === 'secondary') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 rounded-2xl ${sizeClasses[size]} ${className}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Experience the Future of Note-Taking
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            See why professionals choose Online Note AI for their most important ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button
                size={buttonSizes[size]}
                onClick={() => handleCTAClick('trial')}
                className="bg-primary hover:bg-primary/90 px-6"
              >
                Try It Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/features">
              <Button
                variant="outline"
                size={buttonSizes[size]}
                onClick={() => handleCTAClick('learn_more')}
                className="px-6"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className={`text-center ${className}`}
      >
        <Link to="/register">
          <Button
            size={buttonSizes[size]}
            onClick={() => handleCTAClick('minimal')}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'urgent') {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-200 dark:border-red-800 rounded-2xl ${sizeClasses[size]} ${className}`}
      >
        <div className="absolute top-4 right-4">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            LIMITED TIME
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-red-900 dark:text-red-100">
            Special Launch Offer!
          </h3>
          <p className="text-lg mb-6 text-red-800 dark:text-red-200">
            Get 3 months free with any annual plan. Offer ends soon!
          </p>
          
          <Link to="/register">
            <Button
              size={buttonSizes[size]}
              onClick={() => handleCTAClick('urgent')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 animate-pulse"
            >
              Claim Offer Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-4">
            Limited time offer. Terms and conditions apply.
          </p>
        </div>
      </motion.section>
    );
  }

  return null;
};

export default MarketingCTA;