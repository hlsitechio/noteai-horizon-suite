import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Folder, FileText, Plus } from 'lucide-react';
import { Note } from '../../../types/note';

interface CollapsedNotesViewProps {
  favoriteNotes: Note[];
  onCreateNote: () => void;
  onCreateFolder: () => void;
}

export function CollapsedNotesView({ 
  favoriteNotes, 
  onCreateNote, 
  onCreateFolder 
}: CollapsedNotesViewProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center py-4 space-y-3">
      {/* Favorites icon */}
      {favoriteNotes.length > 0 && (
        <Button
          variant="ghost" 
          size="sm"
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
          onClick={() => {/* Navigate to favorites */}}
        >
          <Star className="w-5 h-5 text-sidebar-foreground group-hover:text-yellow-500 transition-colors duration-200" />
        </Button>
      )}
      
      {/* Folders icon */}
      <Button
        variant="ghost"
        size="sm" 
        className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
        onClick={onCreateFolder}
      >
        <Folder className="w-5 h-5 text-sidebar-foreground group-hover:text-blue-500 transition-colors duration-200" />
      </Button>
      
      {/* Notes icon */}
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group" 
        onClick={onCreateNote}
      >
        <FileText className="w-5 h-5 text-sidebar-foreground group-hover:text-green-500 transition-colors duration-200" />
      </Button>
      
      {/* Add icon */}
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
        onClick={onCreateNote}
      >
        <Plus className="w-5 h-5 text-sidebar-foreground group-hover:text-primary transition-colors duration-200" />
      </Button>
    </div>
  );
}