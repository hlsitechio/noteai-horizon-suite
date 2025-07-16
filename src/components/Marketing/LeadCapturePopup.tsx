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
  const benefits = [{
    icon: Download,
    text: 'Free Productivity Templates Pack'
  }, {
    icon: Mail,
    text: 'Weekly AI productivity tips'
  }, {
    icon: Gift,
    text: 'Exclusive early access to new features'
  }, {
    icon: Users,
    text: 'Join 25,000+ professionals'
  }];
  if (!isOpen) return null;
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      
    </motion.div>;
};
export default LeadCapturePopup;