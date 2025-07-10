import React from 'react';
import ReferralProgram from '../components/Marketing/ReferralProgram';
import { useAuth } from '../contexts/AuthContext';
import SEOOptimizer from '../components/Marketing/SEOOptimizer';

const ReferralPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <SEOOptimizer 
        title="Refer Friends & Earn Rewards - Online Note AI"
        description="Invite friends to Online Note AI and earn rewards together. Get $10 for each successful referral plus exclusive bonuses."
        keywords={['referral program', 'earn rewards', 'invite friends', 'ai notes referral']}
      />
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Invite Friends, Earn Together</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share the power of AI note-taking and get rewarded for helping others boost their productivity.
            </p>
          </div>
          
          <ReferralProgram 
            variant="dashboard" 
            userEmail={user?.email || 'user@example.com'} 
          />
        </div>
      </div>
    </>
  );
};

export default ReferralPage;