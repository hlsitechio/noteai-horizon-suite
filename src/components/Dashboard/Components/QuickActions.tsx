import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

const quickActions = [
  {
    id: 'new-note',
    label: 'New Note',
    icon: Plus,
    variant: 'default' as const,
    description: 'Create a new note'
  },
  {
    id: 'view-docs',
    label: 'Documents',
    icon: FileText,
    variant: 'outline' as const,
    description: 'View all documents'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: Calendar,
    variant: 'outline' as const,
    description: 'Open calendar'
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    variant: 'outline' as const,
    description: 'Manage team'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    variant: 'ghost' as const,
    description: 'App settings'
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    variant: 'ghost' as const,
    description: 'Export data'
  }
];

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          <Badge variant="secondary" className="text-xs">
            6 actions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.slice(0, 4).map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                className="h-auto p-3 flex flex-col items-center space-y-1"
                title={action.description}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-2 pt-2 border-t">
          {quickActions.slice(4).map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                className="w-full justify-start"
                title={action.description}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>

        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}