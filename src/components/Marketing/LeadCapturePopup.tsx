import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Mail, CheckCircle, Gift, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeSendAnalyticsEvent, trackMarketingConversion } from '@/utils/safeAnalytics';

interface LeadCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'exit_intent' | 'time_delay' | 'scroll_depth';
}

const LeadCapturePopup: React.FC<LeadCapturePopupProps> = ({ 
  isOpen, 
  onClose, 
  trigger = 'exit_intent' 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Track the lead capture attempt
    safeSendAnalyticsEvent('lead_capture_popup_submit', {
      trigger,
      email_domain: email.split('@')[1] || 'unknown'
    });

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      trackMarketingConversion('popup_lead_capture');
      setIsSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 3000);
      
    } catch (error) {
      console.error('Lead capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Download, text: 'Free Productivity Templates Pack' },
    { icon: Mail, text: 'Weekly AI productivity tips' },
    { icon: Gift, text: 'Exclusive early access to new features' },
    { icon: Users, text: 'Join 25,000+ professionals' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-background border border-border rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground mb-4">
              Check your email for the productivity templates pack and weekly tips.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Closing automatically...</span>
            </div>
          </div>
        ) : (
          /* Lead Capture Form */
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">
                Wait! Get Your Free Productivity Boost
              </h3>
              <p className="text-muted-foreground">
                Before you go, grab our exclusive templates pack used by 25,000+ professionals
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <benefit.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Get Free Templates Pack
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              No spam, ever. Unsubscribe anytime with one click.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LeadCapturePopup;