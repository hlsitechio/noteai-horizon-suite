import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStartTour, onSkip }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to Online Note AI!
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">Thank you for joining us!</span>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-3">
            <p className="text-foreground">
              Your account has been successfully created! 🎉
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We're excited to help you organize your thoughts with AI-powered note-taking. 
              Let us show you around to get you started quickly.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span>AI-powered organization and insights</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Smart search and categorization</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Collaborative workspaces</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={onStartTour} 
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take the Tour
            </Button>
            <Button 
              onClick={onSkip} 
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}