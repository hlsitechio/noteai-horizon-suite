import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, ArrowRight, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const OnboardingProfileSection: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Initialize state when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setWelcomeMessage(user.welcome_message || 'Welcome back');
    }
  }, [user]);

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
        toast.success('Profile picture updated successfully');
        await refreshUser();
      }
    } catch (error) {
      console.error('Avatar upload exception:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
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
        toast.success('Profile updated successfully');
        await refreshUser();
        setProfileCompleted(true);

        if (isOnboarding) {
          // Mark initial onboarding as completed and redirect to dashboard onboarding
          await supabase
            .from('user_onboarding')
            .upsert({
              user_id: user.id,
              initial_onboarding_completed: true,
            }, {
              onConflict: 'user_id'
            });

          // Small delay for better UX
          setTimeout(() => {
            navigate('/app/dashboard/onboarding');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Profile update exception:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const canProceed = name.trim().length > 0 && email.trim().length > 0;

  if (profileCompleted && isOnboarding) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="bg-green-500/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Profile Setup Complete!</h3>
        <p className="text-muted-foreground mb-4">
          Redirecting you to dashboard setup...
        </p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          {isOnboarding ? 'Complete Your Profile' : 'Profile Information'}
        </CardTitle>
        {isOnboarding && (
          <p className="text-muted-foreground">
            Let's set up your profile to personalize your experience
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section - Centered */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} className="object-cover" />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {(name || user?.name)?.[0]?.toUpperCase() || 'U'}
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
              {isOnboarding ? 'Add a profile picture (optional)' : 'Click the camera icon to update your profile picture'}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Nickname / Display Name
            </label>
            <Input 
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="How should we greet you?"
            />
            <p className="text-xs text-muted-foreground">
              This will appear in your dashboard welcome message
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </label>
            <Input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="h-11 rounded-lg border-2 focus:border-primary transition-colors" 
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            onClick={handleUpdateProfile}
            disabled={isUpdating || !canProceed}
            className="w-full h-11 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isOnboarding ? 'Setting up profile...' : 'Updating Profile...'}
              </>
            ) : (
              <>
                {isOnboarding ? (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </>
            )}
          </Button>
          {!canProceed && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Please fill in all required fields to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingProfileSection;