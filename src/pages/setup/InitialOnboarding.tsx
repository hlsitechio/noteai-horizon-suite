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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-purple-500/20 shadow-2xl bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <User className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                What best describes your role?
              </h1>
              <p className="text-gray-300 text-lg">
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
                          ? 'border-2 border-purple-500 bg-purple-500/10 shadow-lg'
                          : 'border border-gray-700 hover:border-purple-500/50 bg-gray-800/50'
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`mb-3 flex justify-center ${
                          selectedRole === role.id ? 'text-purple-400' : 'text-gray-400'
                        }`}>
                          {role.icon}
                        </div>
                        <h3 className={`font-semibold mb-1 ${
                          selectedRole === role.id ? 'text-purple-400' : 'text-white'
                        }`}>
                          {role.label}
                        </h3>
                        <p className="text-xs text-gray-400">
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
                className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700 text-white"
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
              
              {/* Quick Mobile Access Button */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Want to try the mobile experience?</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/mobile')}
                  className="w-full"
                >
                  Access Mobile Interface
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InitialOnboarding;