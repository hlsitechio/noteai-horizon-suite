import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { FEATURES } from '../constants/features';

interface WelcomeStepProps {
  onGetStarted: () => void;
  className?: string;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onGetStarted, className }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-4xl mx-auto border-2 border-primary/10 shadow-2xl">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Online Note AI! 
            <span className="inline-block ml-2">🚀</span>
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your productivity with AI-powered note-taking. Let's customize 
            your workspace to match your workflow perfectly.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.slice(0, 4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardContent className="pt-0">
          <div className="w-full text-center space-y-4">
            <Button 
              onClick={onGetStarted}
              className="h-12 px-8 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              size="lg"
            >
              Let's Get Started
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground">
              This setup will take about 2 minutes to complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};