import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Play, RotateCcw, Info } from 'lucide-react';

export function OnboardingTabContent() {
  const onboarding = useOnboarding();

  if (onboarding.isLoading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const totalSteps = 6;

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Onboarding & Tours
          </CardTitle>
          <CardDescription>
            Manage your app tour and onboarding experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Onboarding */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="onboarding-enabled" className="text-base">
                Enable Onboarding
              </Label>
              <div className="text-sm text-muted-foreground">
                Show guided tours and helpful tips throughout the app
              </div>
            </div>
            <Switch
              id="onboarding-enabled"
              checked={onboarding.onboardingState.enabled}
              onCheckedChange={onboarding.toggleOnboarding}
            />
          </div>

          <Separator />

          {/* Onboarding Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Onboarding Status</h4>
                <p className="text-sm text-muted-foreground">
                  {onboarding.onboardingState.completed 
                    ? 'You have completed the onboarding tour' 
                    : `Step ${onboarding.onboardingState.currentStep + 1} of ${totalSteps}`
                  }
                </p>
              </div>
              <div className="flex gap-2">
                {onboarding.onboardingState.completed ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onboarding.startOnboarding}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart Tour
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onboarding.startOnboarding}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Tour
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round((onboarding.onboardingState.currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.max(0, (onboarding.onboardingState.currentStep / totalSteps) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tour Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Tour Steps</h4>
            <div className="grid gap-2">
              {[
                { id: 'welcome', title: 'Welcome Message', description: 'Introduction to NoteAI Suite' },
                { id: 'dashboard', title: 'Dashboard Overview', description: 'Learn about your main workspace' },
                { id: 'sidebar', title: 'Navigation', description: 'Understand the sidebar and navigation' },
                { id: 'create-note', title: 'Create Notes', description: 'Learn how to create your first note' },
                { id: 'notes-list', title: 'Manage Notes', description: 'Organize and search your notes' },
                { id: 'settings', title: 'Customization', description: 'Personalize your experience' }
              ].map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    onboarding.onboardingState.completedSteps.includes(step.id) 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    onboarding.onboardingState.completedSteps.includes(step.id)
                      ? 'bg-primary text-primary-foreground'
                      : index === onboarding.onboardingState.currentStep
                      ? 'bg-secondary text-foreground border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  {onboarding.onboardingState.completedSteps.includes(step.id) && (
                    <div className="text-primary text-xs">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">About Onboarding</h4>
            <p className="text-sm text-muted-foreground">
              The onboarding tour helps you discover features as you navigate through the app. 
              You can enable or disable it at any time, and restart the tour whenever you want 
              to refresh your knowledge of the interface.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}