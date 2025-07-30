import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, Users, Trophy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  rewardsEarned: number;
  nextReward: number;
}

interface ReferralProgramProps {
  variant?: 'dashboard' | 'modal' | 'inline';
  userEmail?: string;
  className?: string;
}

const ReferralProgram: React.FC<ReferralProgramProps> = ({ 
  variant = 'dashboard',
  userEmail = 'user@example.com',
  className = '' 
}) => {
  const [referralCode] = useState('AI-NOTE-2024');
  const [shareUrl] = useState(`https://onlinenote.ai/register?ref=${referralCode}`);
  const { toast } = useToast();

  // Mock data - replace with real user stats
  const stats: ReferralStats = {
    totalReferrals: 12,
    successfulReferrals: 8,
    rewardsEarned: 240,
    nextReward: 300
  };

  const rewards = [
    { threshold: 1, reward: '$10 Credit', icon: Gift, unlocked: true },
    { threshold: 5, reward: '1 Month Pro', icon: Trophy, unlocked: true },
    { threshold: 10, reward: '$50 Credit', icon: Gift, unlocked: false },
    { threshold: 25, reward: '6 Months Pro', icon: Trophy, unlocked: false },
    { threshold: 50, reward: '$200 Credit', icon: Gift, unlocked: false },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      safeSendAnalyticsEvent('referral_link_copied', {
        variant,
        referral_code: referralCode
      });

      toast({
        title: "Link copied! 📋",
        description: "Share it with friends to earn rewards together.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: string) => {
    safeSendAnalyticsEvent('referral_share_clicked', {
      platform,
      variant,
      referral_code: referralCode
    });

    const text = "Check out Online Note AI - the smartest way to take notes with AI! 🤖📝";
    const url = shareUrl;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent('Try Online Note AI')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, '_blank');
    }
  };

  const progressPercentage = (stats.successfulReferrals / 25) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Invite Friends, Earn Rewards</h2>
            <p className="text-muted-foreground">
              Get $10 for each friend who joins, plus they get their first month free!
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total Invites</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.successfulReferrals}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${stats.rewardsEarned}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${stats.nextReward}</div>
              <div className="text-sm text-muted-foreground">Next Goal</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress to next reward</span>
              <span className="text-sm text-muted-foreground">{stats.successfulReferrals}/25</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Share Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-background border-border/50"
                />
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="shrink-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => handleShare('twitter')}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare('linkedin')}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Share2 className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                onClick={() => handleShare('email')}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Rewards Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Reward Milestones</h3>
          <div className="space-y-4">
            {rewards.map((reward, index) => {
              const Icon = reward.icon;
              const isUnlocked = stats.successfulReferrals >= reward.threshold;
              
              return (
                <div
                  key={reward.threshold}
                  className={`flex items-center p-4 rounded-lg border transition-colors ${
                    isUnlocked 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className={`p-2 rounded-full mr-4 ${
                    isUnlocked ? 'bg-green-500' : 'bg-muted'
                  }`}>
                    {isUnlocked ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isUnlocked ? 'text-white' : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{reward.reward}</div>
                    <div className="text-sm text-muted-foreground">
                      {reward.threshold} successful referral{reward.threshold > 1 ? 's' : ''}
                    </div>
                  </div>
                  {isUnlocked && (
                    <div className="text-green-600 font-medium text-sm">
                      Unlocked!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReferralProgram;