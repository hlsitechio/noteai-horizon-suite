import React from 'react';
import { createNoteObject } from '@/utils/noteHelpers';
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
import { ComponentLibraryButton } from './ComponentLibraryButton';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { toast } from 'sonner';

type QuickAction = {
  id: string;
  label: string;
  icon: React.ElementType;
  variant: 'default' | 'outline' | 'ghost';
  description: string;
  onClick?: () => void;
};


export function QuickActions() {
  const navigate = useNavigate();
  const { createNote } = useOptimizedNotes();

  // Action handlers
  const handleNewNote = async () => {
    try {
      const newNote = await createNote({
        title: 'New Note',
        content: '',
        tags: [],
        category: 'general',
        isFavorite: false
      });
      if (newNote) {
        navigate(`/app/notes?note=${newNote.id}`);
        toast.success('New note created!');
      }
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleViewDocuments = () => {
    navigate('/app/explorer');
  };

  const handleSchedule = () => {
    navigate('/app/calendar');
  };

  const handleTeam = () => {
    // For now, show a message about upcoming feature
    toast.info('Team collaboration features coming soon!');
  };

  const handleSettings = () => {
    navigate('/app/settings');
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon!');
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-note',
      label: 'New Note',
      icon: Plus,
      variant: 'default',
      description: 'Create a new note',
      onClick: handleNewNote
    },
    {
      id: 'view-docs',
      label: 'Documents',
      icon: FileText,
      variant: 'outline',
      description: 'View all documents',
      onClick: handleViewDocuments
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      variant: 'outline',
      description: 'Open calendar',
      onClick: handleSchedule
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      variant: 'outline',
      description: 'Manage team',
      onClick: handleTeam
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      variant: 'ghost',
      description: 'App settings',
      onClick: handleSettings
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      variant: 'ghost',
      description: 'Export your data',
      onClick: handleExport
    }
  ];

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
    <Card className="h-full group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {quickActions.length} actions
            </Badge>
            <ComponentLibraryButton componentName="quick actions" />
          </div>
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
