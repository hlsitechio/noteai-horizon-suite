import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Navigation, FileText, Settings, Bell, User, SkipForward, Check } from 'lucide-react';

interface TourStepProps {
  onTourCompleted: () => void;
  onSkip: () => void;
  onBackToTheme: () => void;
  className?: string;
}

const tourSteps = [
  {
    id: 'navigation',
    title: 'Navigation Sidebar',
    description: 'Access all your main features here - Notes, Calendar, Settings, and more. Click the menu icon to collapse or expand.',
    position: { top: '25%', left: '16rem' },
    highlight: 'left-0 top-0 w-60 h-full',
    icon: Navigation
  },
  {
    id: 'content',
    title: 'Main Content Area', 
    description: 'This is where your notes, dashboard widgets, and main content will appear. Everything is customizable based on your preferences.',
    position: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
    highlight: 'left-60 top-0 right-0 bottom-0',
    icon: FileText
  },
  {
    id: 'profile',
    title: 'Profile & Quick Actions',
    description: 'Access your profile, notifications, and quick settings from the top-right corner.',
    position: { top: '15%', right: '1rem' },
    highlight: 'right-0 top-0 w-80 h-16',
    icon: User
  },
  {
    id: 'settings',
    title: 'Settings & Customization',
    description: 'Personalize your experience with themes, preferences, and advanced settings available in the sidebar bottom section.',
    position: { bottom: '25%', left: '16rem' },
    highlight: 'left-0 bottom-0 w-60 h-40',
    icon: Settings
  }
];

export const TourStep: React.FC<TourStepProps> = ({ 
  onTourCompleted, 
  onSkip, 
  onBackToTheme,
  className 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = tourSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onTourCompleted();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isLastStep = currentStepIndex === tourSteps.length - 1;
  const IconComponent = currentStep.icon;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Dark overlay that blurs everything */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Precise highlight box for current step */}
      <div 
        className={`absolute bg-white/10 border-2 border-primary/80 rounded-lg transition-all duration-500 pointer-events-none shadow-lg ${currentStep.highlight}`}
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3)'
        }}
      />

      {/* Tour Tooltip */}
      <Card 
        className="absolute z-20 w-80 shadow-2xl border-primary/30 bg-background/95 backdrop-blur border-2"
        style={currentStep.position}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{currentStep.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToTheme}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Theme
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onSkip} className="gap-2">
                <SkipForward className="h-4 w-4" />
                Skip Tour
              </Button>
              
              {currentStepIndex > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              
              <Button onClick={handleNext} size="sm" className="gap-2">
                {isLastStep ? (
                  <>
                    <Check className="h-4 w-4" />
                    Finish Tour
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Counter */}
          <div className="text-center mt-3 text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {tourSteps.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};