
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileNoteCard from '../components/MobileNoteCard';
import MobileFilterSheet from '../components/MobileFilterSheet';

const MobileNotes: React.FC = () => {
  const { filteredNotes, filters, setFilters, createNote, setCurrentNote } = useOptimizedNotes();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');

  // If there's a note parameter, automatically go to editor
  useEffect(() => {
    if (noteId) {
      navigate('/mobile/editor');
    }
  }, [noteId, navigate]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, searchTerm: value });
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'New Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null,
      });
      setCurrentNote(newNote);
      navigate('/mobile/editor');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background min-h-0 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center space-x-3 z-10">
        <h1 className="text-lg font-semibold text-foreground">Mobile/Notes</h1>
      </div>
      
      {/* Search and Actions */}
      <div className="p-4 space-y-3 flex-shrink-0 bg-background border-b">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="h-10 px-3"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <Button onClick={handleCreateNote} className="w-full h-12">
          <Plus className="w-5 h-5 mr-2" />
          Create New Note
        </Button>
      </div>

      {/* Notes List - Fixed scrolling container */}
      <div className="flex-1 min-h-0 bg-background w-full overflow-hidden">
        <div className="h-full w-full overflow-y-auto px-4 py-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notes found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first note to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredNotes.map((note) => (
                <MobileNoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Sheet */}
      <MobileFilterSheet 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default MobileNotes;
