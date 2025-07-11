import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowRight, User, Palette, BarChart3, Code, PenTool, GraduationCap, MoreHorizontal } from 'lucide-react';

type UserRole = 'developer' | 'designer' | 'product_manager' | 'analyst' | 'content_creator' | 'student' | 'other';

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'developer',
    label: 'Developer',
    icon: <Code className="w-6 h-6" />,
    description: 'Building applications and writing code'
  },
  {
    id: 'designer',
    label: 'Designer',
    icon: <Palette className="w-6 h-6" />,
    description: 'Creating user experiences and interfaces'
  },
  {
    id: 'product_manager',
    label: 'Product Manager',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Managing products and strategy'
  },
  {
    id: 'analyst',
    label: 'Analyst',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Data analysis and insights'
  },
  {
    id: 'content_creator',
    label: 'Content Creator',
    icon: <PenTool className="w-6 h-6" />,
    description: 'Creating content and media'
  },
  {
    id: 'student',
    label: 'Student',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Learning and studying'
  },
  {
    id: 'other',
    label: 'Other',
    icon: <MoreHorizontal className="w-6 h-6" />,
    description: 'Something else entirely'
  }
];

const InitialOnboarding: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleGetStarted = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    try {
      // Update user preferences with selected role
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          user_role: selectedRole,
        }, {
          onConflict: 'user_id'
        });

      if (preferencesError) {
        console.error('Error updating preferences:', preferencesError);
        toast.error('Failed to save your preferences');
        return;
      }

      // Navigate to settings to complete profile setup
      navigate('/app/settings?tab=profile&onboarding=true');
      toast.success('Great! Let\'s set up your profile');

    } catch (error) {
      console.error('Error in onboarding:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                What best describes your role?
              </h1>
              <p className="text-muted-foreground text-lg">
                Understanding your role helps us improve your experience.
              </p>
            </div>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <AnimatePresence>
                {roleOptions.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                        selectedRole === role.id
                          ? 'border-2 border-primary bg-primary/5 shadow-lg'
                          : 'border border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`mb-3 flex justify-center ${
                          selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {role.icon}
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          selectedRole === role.id ? 'text-primary' : 'text-foreground'
                        }`}>
                          {role.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleGetStarted}
                disabled={!selectedRole || isLoading}
                size="lg"
                className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    Get started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InitialOnboarding;