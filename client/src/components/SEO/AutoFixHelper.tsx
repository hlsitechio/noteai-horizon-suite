import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bot, 
  MessageSquare, 
  Copy, 
  CheckCircle, 
  Lightbulb,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AutoFixHelperProps {
  onClose?: () => void;
}

export const AutoFixHelper: React.FC<AutoFixHelperProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Click 'Fix Issues'",
      description: "Click any 'Fix Issues' button next to detected problems",
      icon: <Bot className="h-5 w-5" />
    },
    {
      title: "Auto-Prompt Generated",
      description: "A detailed fix prompt is automatically created and copied to clipboard",
      icon: <Copy className="h-5 w-5" />
    },
    {
      title: "Paste in Chat",
      description: "Paste the prompt in Lovable AI chat for instant step-by-step help",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: "Get Fixed!",
      description: "The AI will guide you through fixing the issue with code changes",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Powered Auto-Fix System
        </CardTitle>
        <CardDescription>
          Click "Fix Issues" buttons to automatically generate targeted prompts for the Lovable AI chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>How It Works</AlertTitle>
          <AlertDescription>
            Each technical issue gets converted into a detailed, actionable prompt that you can send directly to the AI for instant help.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((stepItem, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {stepItem.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{stepItem.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{stepItem.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/30 p-4 rounded-lg border">
          <h4 className="font-medium text-sm mb-2">What Gets Auto-Fixed:</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Missing H1 tags',
              'Broken internal links', 
              'Large image files',
              'Missing alt text',
              'Duplicate meta descriptions',
              'Mobile responsiveness',
              'HTTPS certificate issues',
              'Core Web Vitals',
              'Page speed optimization',
              'Technical SEO issues'
            ].map((issue, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {issue}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            🤖 Powered by intelligent prompt generation
          </p>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Got it!
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoFixHelper;