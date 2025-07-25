import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, User, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import StatusBarProfileSettings from '@/components/StatusBar/StatusBarProfileSettings';

const ProfileSection: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Initialize state when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setWelcomeMessage(user.welcome_message || 'Welcome back');
    }
  }, [user]);

  // Debounced values for real-time updates
  const [debouncedName] = useDebounce(name, 500);
  const [debouncedWelcomeMessage] = useDebounce(welcomeMessage, 500);

  // Real-time update function
  const updateProfileRealTime = useCallback(async (updates: { display_name?: string; welcome_message?: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...updates,
        }, {
          onConflict: 'id'
        });

      if (!error) {
        // Refresh the user data in AuthContext to update the top nav in real-time
        await refreshUser();
      }
    } catch (error) {
      console.error('Real-time update error:', error);
    }
  }, [user, refreshUser]);

  // Effect for real-time name updates
  useEffect(() => {
    // Allow clearing the name field - update even if debouncedName is empty
    if (user && debouncedName !== user?.name) {
      updateProfileRealTime({ display_name: debouncedName });
    }
  }, [debouncedName, user?.name, updateProfileRealTime, user]);

  // Effect for real-time welcome message updates
  useEffect(() => {
    if (debouncedWelcomeMessage && debouncedWelcomeMessage !== user?.welcome_message && user && debouncedWelcomeMessage.trim()) {
      updateProfileRealTime({ welcome_message: debouncedWelcomeMessage });
    }
  }, [debouncedWelcomeMessage, user?.welcome_message, updateProfileRealTime, user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('Updating profile for user');
      }
      
      // Update the user profile in our profiles table
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          display_name: name,
          email: email,
          welcome_message: welcomeMessage,
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Profile update error:', error);
        toast.error('Failed to update profile');
      } else {
        console.log('Profile updated successfully');
        toast.success('Profile updated successfully');
        // Refresh the user data in AuthContext
        await refreshUser();
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Create a unique filename with timestamp to avoid caching issues
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Development logging only
      if (import.meta.env.DEV) {
        console.log('Uploading avatar for user');
      }

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload profile picture');
        return;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Avatar uploaded, public URL:', data.publicUrl);

      // Update the user profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          avatar_url: data.publicUrl,
          display_name: name || user.name,
          email: email || user.email,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error('Profile update error:', updateError);
        toast.error('Failed to update profile picture');
      } else {
        console.log('Profile picture updated successfully');
        toast.success('Profile picture updated successfully');
        // Refresh the user data in AuthContext
        await refreshUser();
      }
    } catch (error) {
      console.error('Avatar upload exception:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section - Centered */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} className="object-cover" />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-lg hover:scale-105"
            >
              {isUploadingAvatar ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={isUploadingAvatar}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Click the camera icon to update your profile picture
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Welcome Message
            </label>
            <Input 
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="Enter your welcome message"
            />
            <p className="text-xs text-muted-foreground">
              This message will appear in the top navigation bar
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="w-full h-11 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            size="lg"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Profile...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Update Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    
    <StatusBarProfileSettings />
    </div>
  );
};

export default ProfileSection;