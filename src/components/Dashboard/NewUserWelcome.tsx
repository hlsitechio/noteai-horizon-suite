import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Shield, Zap, Users, Target } from 'lucide-react';
import { InitializeDashboardButton } from './InitializeDashboardButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Smart suggestions, auto-categorization, and content enhancement'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely with full privacy controls'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with real-time synchronization across devices'
  },
  {
    icon: Users,
    title: 'Collaborative Workspace',
    description: 'Share notes, folders, and collaborate with your team seamlessly'
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Track your progress with built-in analytics and productivity insights'
  }
];

interface NewUserWelcomeProps {
  onDashboardInitialized?: () => void;
  className?: string;
}

export const NewUserWelcome: React.FC<NewUserWelcomeProps> = ({ 
  onDashboardInitialized,
  className 
}) => {
  const { user } = useAuth();
  const [isDashboardInitialized, setIsDashboardInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if dashboard is already initialized
  useEffect(() => {
    const checkDashboardStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has dashboard settings (indicating initialization)
        const { data: dashboardSettings } = await supabase
          .from('dashboard_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        // Check if user has any notes (another indicator)
        const { data: notes, count } = await supabase
          .from('notes_v2')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .limit(1);

        // Check if user has folders
        const { data: folders, count: foldersCount } = await supabase
          .from('folders')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .limit(1);

        // Consider dashboard initialized if they have settings or content
        const hasSettings = dashboardSettings?.settings && 
          typeof dashboardSettings.settings === 'object' && 
          (dashboardSettings.settings as any)?.initialized;
        const hasContent = (count || 0) > 0 || (foldersCount || 0) > 0;
        
        setIsDashboardInitialized(hasSettings || hasContent);
      } catch (error) {
        console.error('Error checking dashboard status:', error);
        setIsDashboardInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDashboardStatus();
  }, [user]);

  const handleDashboardInitialized = () => {
    setIsDashboardInitialized(true);
    onDashboardInitialized?.();
  };

  // Don't show if dashboard is already initialized or still loading
  if (isLoading || isDashboardInitialized || !user) {
    return null;
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Hero Section */}
      <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary/10 p-4 rounded-full">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to Online Note AI! 🎉
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto mt-2">
            Transform your productivity with AI-powered note-taking. Let's set up your personalized workspace to get you started on your journey to smarter organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-xs">New User</Badge>
            <Badge variant="outline" className="text-xs">Setup Required</Badge>
            <Badge variant="default" className="text-xs">AI-Powered</Badge>
          </div>

          <div className="max-w-md mx-auto">
            <InitializeDashboardButton
              onInitialized={handleDashboardInitialized}
              variant="default"
              size="lg"
              className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will create your personal storage, settings, and welcome content
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* What You'll Get Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            What happens during initialization?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">🗄️ Personal Storage</h4>
              <p className="text-muted-foreground">Secure buckets for your files, banners, and attachments</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">⚙️ Dashboard Settings</h4>
              <p className="text-muted-foreground">Optimized preferences and layout configurations</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">📁 Folder Structure</h4>
              <p className="text-muted-foreground">Organized workspace with default folders</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">📝 Welcome Content</h4>
              <p className="text-muted-foreground">Helpful guides and tips to get you started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};