import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content?: string;
}

interface NoteShareButtonProps {
  note: Note;
}

const NoteShareButton: React.FC<NoteShareButtonProps> = ({ note }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Placeholder for share functionality
    console.log('Share note:', note.title);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="p-1 h-6 w-6 text-blue-500 hover:bg-blue-50"
      onClick={handleShare}
    >
      <Share2 className="w-3 h-3" />
    </Button>
  );
};

export default NoteShareButton;