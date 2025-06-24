
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { share } from 'lucide-react';
import { Note } from '../../types/note';
import NoteShareModal from './NoteShareModal';

interface NoteShareButtonProps {
  note: Note;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

const NoteShareButton: React.FC<NoteShareButtonProps> = ({ 
  note, 
  variant = 'ghost', 
  size = 'sm',
  showLabel = false 
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className="flex items-center gap-2"
      >
        <share className="w-4 h-4" />
        {showLabel && 'Share'}
      </Button>

      <NoteShareModal
        note={note}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default NoteShareButton;
