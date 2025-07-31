import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Mail, FileText, Video, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { safeSendAnalyticsEvent, trackMarketingConversion } from '@/utils/safeAnalytics';

interface LeadMagnetItem {
  id: string;
  title: string;
  description: string;
  type: 'ebook' | 'template' | 'checklist' | 'video' | 'course';
  icon: React.ComponentType<any>;
  fileSize?: string;
  pages?: number;
  duration?: string;
  rating?: number;
  downloads?: number;
}

interface LeadMagnetProps {
  variant?: 'modal' | 'inline' | 'sidebar';
  itemId?: string;
  className?: string;
}

const LeadMagnet: React.FC<LeadMagnetProps> = ({ 
  variant = 'inline',
  itemId,
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const leadMagnets: LeadMagnetItem[] = [
    {
      id: 'productivity-guide',
      title: 'The Ultimate AI Note-Taking Productivity Guide',
      description: 'Discover 25 proven strategies to boost your productivity by 300% using AI-powered note-taking techniques.',
      type: 'ebook',
      icon: FileText,
      fileSize: '2.3 MB',
      pages: 47,
      rating: 4.9,
      downloads: 12547
    },
    {
      id: 'meeting-templates',
      title: '10 Meeting Note Templates That Actually Work',
      description: 'Ready-to-use templates for different meeting types, from standups to strategy sessions.',
      type: 'template',
      icon: CheckCircle,
      fileSize: '890 KB',
      rating: 4.8,
      downloads: 8934
    },
    {
      id: 'masterclass',
      title: 'AI Note-Taking Masterclass (Free)',
      description: 'Complete video course covering advanced AI features, organization strategies, and collaboration tips.',
      type: 'video',
      icon: Video,
      duration: '2.5 hours',
      rating: 4.9,
      downloads: 5621
    }
  ];

  const selectedItem = itemId 
    ? leadMagnets.find(item => item.id === itemId) 
    : leadMagnets[0];

  if (!selectedItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Track lead magnet conversion
      safeSendAnalyticsEvent('lead_magnet_conversion', {
        item_id: selectedItem.id,
        item_type: selectedItem.type,
        email_domain: email.split('@')[1],
        variant
      });

      trackMarketingConversion('lead_magnet', 1);

      // Simulate API call to subscribe user and send lead magnet
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSuccess(true);
      setEmail('');

      toast({
        title: "Success! Check your email 📧",
        description: `We've sent "${selectedItem.title}" to your inbox along with bonus materials.`,
      });

      // Reset success state after showing success message
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      safeSendAnalyticsEvent('lead_magnet_error', {
        item_id: selectedItem.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = selectedItem.icon;

  if (variant === 'modal') {
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-background rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
            <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isSuccess}
              required
            />
            
            <Button
              type="submit"
              disabled={!email || isSubmitting || isSuccess}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : isSuccess ? 'Sent!' : 'Get Free Download'}
              <Download className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`p-6 sticky top-8 ${className}`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-bold mb-2">{selectedItem.title}</h4>
          <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSuccess}
            required
          />
          
          <Button
            type="submit"
            disabled={!email || isSubmitting || isSuccess}
            className="w-full"
          >
            {isSubmitting ? 'Sending...' : 'Download Free'}
          </Button>
        </form>

        <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
          {selectedItem.rating} • {selectedItem.downloads?.toLocaleString()} downloads
        </div>
      </Card>
    );
  }

  // Default inline variant
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={className}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mr-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    FREE {selectedItem.type.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{selectedItem.title}</h3>
              <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {selectedItem.pages && (
                  <span>{selectedItem.pages} pages</span>
                )}
                {selectedItem.duration && (
                  <span>{selectedItem.duration}</span>
                )}
                {selectedItem.fileSize && (
                  <span>{selectedItem.fileSize}</span>
                )}
                {selectedItem.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {selectedItem.rating}
                  </div>
                )}
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || isSuccess}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={!email || isSubmitting || isSuccess}
                    className="shrink-0"
                  >
                    {isSubmitting ? 'Sending...' : isSuccess ? 'Sent!' : 'Get Free Access'}
                    <Download className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Join {selectedItem.downloads?.toLocaleString()} professionals who've downloaded this resource. 
                  No spam, unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
};

export default LeadMagnet;