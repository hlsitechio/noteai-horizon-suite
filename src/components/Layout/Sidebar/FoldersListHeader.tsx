import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  Plus
} from 'lucide-react';

interface FoldersListHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  onCreateFolder: () => Promise<void>;
  foldersCount: number;
  isMobile: boolean;
}

export function FoldersListHeader({ 
  isExpanded, 
  onToggle, 
  onCreateFolder, 
  foldersCount, 
  isMobile 
}: FoldersListHeaderProps) {
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
              <Folder className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="font-medium">Folders</p>
            <p className="text-xs text-muted-foreground">{foldersCount} folders</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div 
            className="flex items-center cursor-pointer text-xs font-medium text-sidebar-foreground/70 hover:text-accent transition-colors p-1 h-auto flex-1"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            <Folder className="h-3 w-3 mr-1" />
            Folders
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-sidebar-foreground/70">({foldersCount})</span>
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder();
                }}
                title="Create Folder"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}