import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer';
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  variant = 'inline', 
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    try {
      // Track newsletter signup attempt
      safeSendAnalyticsEvent('newsletter_signup_attempt', {
        variant,
        email_domain: email.split('@')[1]
      });

      // Simulate API call - replace with actual newsletter service integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setEmail('');
      
      // Track successful signup
      safeSendAnalyticsEvent('newsletter_signup_success', {
        variant,
        email_domain: email.split('@')[1]
      });

      toast({
        title: "Welcome aboard! 🎉",
        description: "You'll receive our weekly insights and product updates.",
      });

      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      safeSendAnalyticsEvent('newsletter_signup_error', {
        variant,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const variantStyles = {
    inline: "p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl",
    modal: "p-8 bg-background border-2 border-primary/20 rounded-2xl shadow-lg",
    footer: "p-4 bg-muted/30 rounded-xl"
  };

  return (
    <motion.div 
      className={`${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">
          {variant === 'footer' ? 'Stay Updated' : 'Join 10,000+ AI-Powered Professionals'}
        </h3>
        <p className="text-muted-foreground">
          Get weekly insights, productivity tips, and early access to new features.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSuccess}
              className="w-full h-12 px-4 bg-background/80 border-border/50 focus:border-primary/50 transition-colors"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={!email || isLoading || isSuccess}
            className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Subscribed!
              </>
            ) : (
              'Subscribe Free'
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          No spam. Unsubscribe at any time. Read our{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </form>

      {variant === 'inline' && (
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Weekly insights
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            Product updates
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
            Early access
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NewsletterSignup;