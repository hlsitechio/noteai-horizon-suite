
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, Users, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EnhancedMobileNoteCard from '../components/EnhancedMobileNoteCard';
import MobileFilterSheet from '../components/MobileFilterSheet';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const EnhancedMobileNotes: React.FC = () => {
  const { filteredNotes, filters, setFilters, createNote, setCurrentNote, notes } = useNotes();
  const { folders } = useFolders();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
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

  // Filter notes based on active tab
  const getFilteredNotes = () => {
    switch (activeTab) {
      case 'favorites':
        return filteredNotes.filter(note => note.isFavorite);
      case 'recent':
        return filteredNotes.slice(0, 10);
      case 'folders':
        return filteredNotes.filter(note => note.folder_id);
      default:
        return filteredNotes;
    }
  };

  // Group notes by date for conversation-style layout
  const groupNotesByDate = (notes: typeof filteredNotes) => {
    const groups: Record<string, typeof notes> = {};
    
    notes.forEach(note => {
      const date = new Date(note.updatedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    });
    
    return groups;
  };

  const filteredAndGroupedNotes = groupNotesByDate(getFilteredNotes());

  return (
    <div className="h-full w-full flex flex-col bg-background min-h-0 overflow-hidden">
      {/* Dynamic Header */}
      <DynamicMobileHeader 
        showSearch={true}
        rightActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="px-4 py-3 bg-accent/10 border-b flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {notes.length} notes
            </span>
            <span className="text-muted-foreground">
              {folders.length} folders
            </span>
          </div>
          <div className="text-primary font-medium">
            {filteredNotes.length} shown
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
            <TabsTrigger value="folders" className="text-xs">Folders</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notes List - Conversation Style */}
      <div className="flex-1 min-h-0 bg-background w-full overflow-hidden">
        <div className="h-full w-full overflow-y-auto px-4 pb-20">
          {Object.keys(filteredAndGroupedNotes).length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No notes found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === 'favorites' ? 'No favorite notes yet' :
                 activeTab === 'folders' ? 'No notes in folders' :
                 'Create your first note to get started'}
              </p>
              <Button 
                onClick={handleCreateNote} 
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {Object.entries(filteredAndGroupedNotes).map(([date, notes]) => (
                <div key={date} className="space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center justify-center">
                    <div className="bg-accent/50 px-3 py-1 rounded-full">
                      <span className="text-xs font-medium text-muted-foreground">
                        {date}
                      </span>
                    </div>
                  </div>
                  
                  {/* Notes for this date */}
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <EnhancedMobileNoteCard 
                        key={note.id} 
                        note={note}
                        compact={notes.length > 5}
                      />
                    ))}
                  </div>
                </div>
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

export default EnhancedMobileNotes;
