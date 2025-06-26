
import React, { useState } from 'react';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotes } from '../../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';
import MobileNoteCard from '../components/MobileNoteCard';
import MobileFilterSheet from '../components/MobileFilterSheet';

const MobileNotes: React.FC = () => {
  const { filteredNotes, filters, setFilters, createNote, setCurrentNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

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
    <div className="h-full flex flex-col bg-background">
      {/* Search and Actions */}
      <div className="p-4 space-y-3 flex-shrink-0">
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

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <MobileNoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
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
