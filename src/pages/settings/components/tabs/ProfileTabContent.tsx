import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProfileSection from '@/components/Settings/ProfileSection';

export const ProfileTabContent: React.FC = () => {
  return (
    <TabsContent value="profile" className="space-y-6">
      <ProfileSection />
    </TabsContent>
  );
};