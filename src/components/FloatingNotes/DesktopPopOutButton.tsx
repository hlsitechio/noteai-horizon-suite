
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFloatingNotes } from '../../contexts/FloatingNotesContext';
import { Note } from '../../types/note';

interface DesktopPopOutButtonProps {
  note: Note;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showText?: boolean;
}

const DesktopPopOutButton: React.FC<DesktopPopOutButtonProps> = ({
  note,
  size = 'sm',
  className,
  showText = false,
}) => {
  const { openFloatingNote, isNoteFloating } = useFloatingNotes();

  const handlePopOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openFloatingNote(note);
  };

  const isFloating = isNoteFloating(note.id);

  if (showText) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handlePopOut}
        disabled={isFloating}
        className={className}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {isFloating ? 'Already Floating' : 'Pop Out Desktop'}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={handlePopOut}
            disabled={isFloating}
            className={`${className} ${isFloating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'}`}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFloating ? 'Note is already floating on desktop' : 'Pop out note to desktop'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DesktopPopOutButton;
