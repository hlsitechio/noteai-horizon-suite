import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Shield, Zap, Users, Target, ArrowLeft } from 'lucide-react';
import { InitializeDashboardButton } from './InitializeDashboardButton';
import { ComponentSelector } from './ComponentSelector';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'components' | 'initialize'>('welcome');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

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

  const handleGetStarted = () => {
    setCurrentStep('components');
  };

  const handleComponentsSelected = async (components: string[]) => {
    setSelectedComponents(components);
    
    // Save selected components to user preferences
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          dashboard_components: components
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving component preferences:', error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }

    setCurrentStep('initialize');
  };

  const handleSkipComponentSelection = () => {
    setCurrentStep('initialize');
  };

  const handleBackToComponents = () => {
    setCurrentStep('components');
  };

  const handleDashboardInitialized = () => {
    setIsDashboardInitialized(true);
    onDashboardInitialized?.();
  };

  // Don't show if dashboard is already initialized or still loading
  if (isLoading || isDashboardInitialized || !user) {
    return null;
  }

  // Component Selection Step
  if (currentStep === 'components') {
    return (
      <div className={`${className}`}>
        <ComponentSelector
          onComponentsSelected={handleComponentsSelected}
          onSkip={handleSkipComponentSelection}
        />
        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={() => setCurrentStep('welcome')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Welcome
          </Button>
        </div>
      </div>
    );
  }

  // Initialize Step
  if (currentStep === 'initialize') {
    return (
      <div className={`max-w-2xl mx-auto p-6 space-y-6 ${className}`}>
        <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Ready to Initialize! 🚀
            </CardTitle>
            <CardDescription className="text-lg">
              {selectedComponents.length > 0 
                ? `We'll set up your dashboard with ${selectedComponents.length} selected components and create your workspace.`
                : "We'll create your basic workspace with default settings."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InitializeDashboardButton
              onInitialized={handleDashboardInitialized}
              variant="default"
              size="lg"
              className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
            />
            <Button variant="ghost" onClick={handleBackToComponents} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Component Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Welcome Step (default)
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
            Transform your productivity with AI-powered note-taking. Let's customize your workspace to match your workflow perfectly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-xs">New User</Badge>
            <Badge variant="outline" className="text-xs">Custom Setup</Badge>
            <Badge variant="default" className="text-xs">AI-Powered</Badge>
          </div>

          <div className="max-w-sm mx-auto">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Let's Get Started
            </Button>
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
    </div>
  );
};