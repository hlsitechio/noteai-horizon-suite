
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Zap } from 'lucide-react';

interface QuickActionsBlockProps {
  onCreateNote: () => void;
}

const QuickActionsBlock: React.FC<QuickActionsBlockProps> = ({
  onCreateNote,
}) => {
  const quickActions = [
    {
      icon: Plus,
      label: 'New Note',
      action: onCreateNote,
      color: 'bg-blue-500 hover:bg-blue-600',
      primary: true
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      action: () => window.location.href = '/app/analytics',
      color: 'bg-purple-500 hover:bg-purple-600',
      primary: false
    }
  ];

  return (
    <Card className="h-full border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.action}
              className={`w-full justify-start gap-3 h-12 ${action.color} text-white border-0 shadow-sm`}
              size="lg"
            >
              <Icon className="w-5 h-5" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActionsBlock;
