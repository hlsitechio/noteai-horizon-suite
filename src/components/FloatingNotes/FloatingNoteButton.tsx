
import React from 'react';
import { ExternalLink, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFloatingNotes } from '../../contexts/FloatingNotesContext';
import { Note } from '../../types/note';

interface FloatingNoteButtonProps {
  note: Note;
  variant?: 'icon' | 'text';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const FloatingNoteButton: React.FC<FloatingNoteButtonProps> = ({
  note,
  variant = 'icon',
  size = 'sm',
  className,
}) => {
  const { openFloatingNote, isNoteFloating } = useFloatingNotes();

  const handleOpenFloating = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  // Removed debug logs to prevent PostHog rate limiting
    openFloatingNote(note);
  };

  const isFloating = isNoteFloating(note.id);

  // Removed debug logs to prevent PostHog rate limiting

  if (variant === 'text') {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleOpenFloating}
        disabled={isFloating}
        className={className}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {isFloating ? 'Already Floating' : 'Pop Out'}
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
            onClick={handleOpenFloating}
            disabled={isFloating}
            className={className}
          >
            {isFloating ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFloating ? 'Note is floating' : 'Pop out note'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingNoteButton;
