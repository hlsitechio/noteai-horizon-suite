import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  currentStepIndex: number;
  totalSteps: number;
}

export function OnboardingTooltip({
  step,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  currentStepIndex,
  totalSteps
}: OnboardingTooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const calculatePosition = () => {
      if (!step.target) {
        // Center the tooltip if no target
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 200
        });
        setVisible(true);
        return;
      }

      const targetElement = document.querySelector(step.target);
      if (!targetElement) {
        // Fallback to center if target not found
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 200
        });
        setVisible(true);
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 400;
      const tooltipHeight = 200;
      
      let top = rect.top;
      let left = rect.left;

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'top':
          top = rect.top - tooltipHeight - 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 10;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 10;
          break;
        default:
          top = rect.bottom + 10;
          left = rect.left;
      }

      // Ensure tooltip stays within viewport
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      if (top < 10) top = 10;
      if (top + tooltipHeight > window.innerHeight - 10) {
        top = window.innerHeight - tooltipHeight - 10;
      }

      setPosition({ top, left });
      setVisible(true);

      // Highlight target element
      targetElement.classList.add('onboarding-highlight');
      return () => targetElement.classList.remove('onboarding-highlight');
    };

    const timer = setTimeout(calculatePosition, 100);
    return () => clearTimeout(timer);
  }, [step]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onClose} />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-96 shadow-lg border-primary animate-scale-in"
        style={{ 
          top: position.top, 
          left: position.left,
          maxWidth: 'calc(100vw - 20px)'
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{step.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Previous
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <SkipForward className="h-3 w-3" />
                Skip
              </Button>
            </div>
            
            <Button
              onClick={onNext}
              size="sm"
              className="flex items-center gap-1"
            >
              {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
        </CardContent>
      </Card>
    </>
  );
}