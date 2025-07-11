import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import ProfileSection from '@/components/Settings/ProfileSection';
import OnboardingProfileSection from '@/components/Settings/OnboardingProfileSection';

export const ProfileTabContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';

  return (
    <TabsContent value="profile" className="space-y-6">
      {isOnboarding ? <OnboardingProfileSection /> : <ProfileSection />}
    </TabsContent>
  );
};