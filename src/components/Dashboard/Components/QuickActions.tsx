import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  FileText,
  Calendar,
  Users,
  Settings,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type QuickAction = {
  id: string;
  label: string;
  icon: React.ElementType;
  variant: 'default' | 'outline' | 'ghost';
  description: string;
  onClick?: () => void;
};

const quickActions: QuickAction[] = [
  {
    id: 'new-note',
    label: 'New Note',
    icon: Plus,
    variant: 'default',
    description: 'Create a new note'
  },
  {
    id: 'view-docs',
    label: 'Documents',
    icon: FileText,
    variant: 'outline',
    description: 'View all documents'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Calendar,
    variant: 'outline',
    description: 'Open calendar'
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    variant: 'outline',
    description: 'Manage team'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    variant: 'ghost',
    description: 'App settings'
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    variant: 'ghost',
    description: 'Export your data'
  }
];

export function QuickActions() {
  const renderActionButton = (action: QuickAction, isCompact = false) => {
    const IconComponent = action.icon;
    const buttonClasses = isCompact
      ? 'h-auto p-3 flex flex-col items-center space-y-1'
      : 'w-full justify-start';

    return (
      <TooltipProvider key={action.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={action.variant}
              size="sm"
              className={buttonClasses}
              onClick={action.onClick}
              aria-label={action.description}
              title={action.description}
            >
              <IconComponent className={`h-4 w-4 ${isCompact ? '' : 'mr-2'}`} />
              <span className={isCompact ? 'text-xs' : ''}>{action.label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {action.description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {quickActions.length} actions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Grid of compact action buttons */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.slice(0, 4).map((action) => renderActionButton(action, true))}
        </div>

        {/* Vertical stack for utility-style actions */}
        <div className="space-y-2 pt-3 border-t">
          {quickActions.slice(4).map((action) => renderActionButton(action))}
        </div>

        {/* Refresh button */}
        <div className="pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              // Refresh by triggering a re-render instead of page reload
              window.dispatchEvent(new Event('storage'));
            }}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Refresh Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
