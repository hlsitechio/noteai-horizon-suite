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
              onClick={onGetStarted}
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