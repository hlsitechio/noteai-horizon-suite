import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';

interface NotesListHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
  notesCount: number;
  isMobile: boolean;
}

export function NotesListHeader({ 
  isExpanded, 
  onToggle, 
  onCreateNote, 
  notesCount, 
  isMobile 
}: NotesListHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      {isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto justify-center w-8"
              onClick={onToggle}
            >
              <FileText className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">Notes</p>
            <p className="text-xs text-muted-foreground">{notesCount} notes</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto w-full justify-between"
          onClick={onToggle}
        >
          <div className="flex items-center">
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-accent hover:text-accent-foreground transition-colors mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateNote();
                }}
                title="Create Note"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Notes
          </div>
          <span className="text-xs">({notesCount})</span>
        </Button>
      )}
    </div>
  );
}