
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { OnboardingService } from '@/services/onboardingService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Skip, 
  X, 
  Lightbulb,
  CheckCircle 
} from 'lucide-react';

interface OnboardingTourProps {
  isVisible: boolean;
  onClose: () => void;
  flowId?: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isVisible,
  onClose,
  flowId = 'new-user-basics'
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(OnboardingService.getCurrentStep());
  const [flowProgress, setFlowProgress] = useState(OnboardingService.getCurrentFlowProgress());
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && !currentStep) {
      // Start the onboarding flow
      const started = OnboardingService.startFlow(flowId, user?.id);
      if (started) {
        setCurrentStep(OnboardingService.getCurrentStep());
        setFlowProgress(OnboardingService.getCurrentFlowProgress());
      }
    }
  }, [isVisible, flowId, user?.id, currentStep]);

  useEffect(() => {
    if (currentStep && isVisible) {
      // Find target element
      const element = document.querySelector(currentStep.target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = rect.top + scrollTop;
        let left = rect.left + scrollLeft;
        
        // Adjust position based on preferred position
        switch (currentStep.position) {
          case 'top':
            top -= 10;
            left += rect.width / 2;
            break;
          case 'bottom':
            top += rect.height + 10;
            left += rect.width / 2;
            break;
          case 'left':
            top += rect.height / 2;
            left -= 10;
            break;
          case 'right':
            top += rect.height / 2;
            left += rect.width + 10;
            break;
        }
        
        setTooltipPosition({ top, left });
        
        // Scroll element into view if needed
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center' 
        });
        
        // Highlight the element
        element.style.position = 'relative';
        element.style.zIndex = '9999';
        element.style.outline = '3px solid hsl(var(--primary))';
        element.style.outlineOffset = '2px';
        element.style.borderRadius = '8px';
      }
    }
    
    // Cleanup highlight when step changes
    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.outline = '';
        targetElement.style.outlineOffset = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [currentStep, isVisible, targetElement]);

  const handleNext = () => {
    const nextStep = OnboardingService.nextStep(user?.id);
    setCurrentStep(nextStep);
    setFlowProgress(OnboardingService.getCurrentFlowProgress());
    
    if (!nextStep) {
      // Tour completed
      onClose();
    }
  };

  const handlePrevious = () => {
    const prevStep = OnboardingService.previousStep();
    setCurrentStep(prevStep);
    setFlowProgress(OnboardingService.getCurrentFlowProgress());
  };

  const handleSkip = () => {
    if (currentStep?.required) {
      // Can't skip required steps
      return;
    }
    
    const nextStep = OnboardingService.skipStep(user?.id);
    setCurrentStep(nextStep);
    setFlowProgress(OnboardingService.getCurrentFlowProgress());
    
    if (!nextStep) {
      onClose();
    }
  };

  const handleClose = () => {
    // Clear highlighting
    if (targetElement) {
      targetElement.style.position = '';
      targetElement.style.zIndex = '';
      targetElement.style.outline = '';
      targetElement.style.outlineOffset = '';
      targetElement.style.borderRadius = '';
    }
    onClose();
  };

  if (!isVisible || !currentStep) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'absolute',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: currentStep.position === 'left' || currentStep.position === 'right' 
              ? 'translateY(-50%)' 
              : 'translateX(-50%)',
            maxWidth: '400px',
            zIndex: 10000
          }}
          className="pointer-events-auto"
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{currentStep.title}</CardTitle>
                  {currentStep.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Step {flowProgress.currentStep} of {flowProgress.totalSteps}</span>
                  <span>{Math.round(flowProgress.progress)}% complete</span>
                </div>
                <Progress value={flowProgress.progress} className="h-1" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {currentStep.description}
              </p>
              
              <div className="text-sm">
                {typeof currentStep.content === 'string' ? (
                  <p>{currentStep.content}</p>
                ) : (
                  currentStep.content
                )}
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={flowProgress.currentStep === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {!currentStep.required && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="flex items-center gap-1"
                    >
                      <Skip className="h-3 w-3" />
                      Skip
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {flowProgress.currentStep === flowProgress.totalSteps ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Category badge */}
              <div className="flex justify-end">
                <Badge variant="outline" className="text-xs">
                  {currentStep.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Arrow pointer */}
          <div 
            className={`absolute w-3 h-3 bg-background border-t border-l border-primary/20 transform rotate-45 ${
              currentStep.position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2' :
              currentStep.position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2' :
              currentStep.position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2' :
              'left-[-6px] top-1/2 -translate-y-1/2'
            }`}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
