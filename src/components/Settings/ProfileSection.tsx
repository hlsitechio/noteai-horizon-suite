
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      // Update the user profile in our profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: name,
          email: email,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Profile</h3>
          
          <div className="flex gap-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg" 
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
                <Input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="rounded-lg" 
                />
              </div>
            </div>
          </div>

          <Button 
            size="sm" 
            className="self-start"
            onClick={handleUpdateProfile}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
