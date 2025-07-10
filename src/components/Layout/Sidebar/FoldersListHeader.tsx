import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronRight, 
  ChevronDown,
  Folder,
  FolderPlus
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
                  onCreateFolder();
                }}
                title="Create Folder"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            )}
            <Folder className="h-3 w-3 mr-1" />
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1" />
            )}
            Folders
          </div>
          <span className="text-xs">({foldersCount})</span>
        </Button>
      )}
    </div>
  );
}