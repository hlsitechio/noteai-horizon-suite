import React, { useState } from 'react';
import { Search, Plus, Heart, Calendar, Tag, Filter, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotes } from '../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';
import { NoteCategory } from '../types/note';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';

const categories: NoteCategory[] = [
  { value: 'all', label: 'All Categories', color: 'gray' },
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

const Notes: React.FC = () => {
  const { filteredNotes, filters, setFilters, setCurrentNote, deleteNote, isLoading, notes, selectedNote, folders } = useNotes();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, searchTerm: value });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ 
      ...filters, 
      category: category === 'all' ? undefined : category 
    });
  };

  const handleFavoriteFilter = () => {
    setFilters({ 
      ...filters, 
      isFavorite: filters.isFavorite ? undefined : true 
    });
  };

  const handleEditNote = (note: any) => {
    setCurrentNote(note);
    navigate('/app/editor');
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  useQuantumAIIntegration({
    page: '/app/notes',
    content: `Notes page with ${notes.length} notes`,
    metadata: {
      hasNotes: notes.length > 0,
      selectedNote: selectedNote?.id,
      folders: folders.length
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <p className="text-gray-600">Organize and search through your notes</p>
        </div>
        <Button onClick={() => {
          setCurrentNote(null);
          navigate('/app/editor');
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            
            <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={filters.isFavorite ? "default" : "outline"}
              onClick={handleFavoriteFilter}
              className="rounded-xl"
            >
              <Heart className={`w-4 h-4 mr-2 ${filters.isFavorite ? 'fill-current' : ''}`} />
              Favorites
            </Button>

            <div className="text-sm text-gray-500 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {filteredNotes.length} notes found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filters.searchTerm || filters.category || filters.isFavorite
                ? 'No notes match your filters'
                : 'No notes yet'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.searchTerm || filters.category || filters.isFavorite
                ? 'Try adjusting your search or filters'
                : 'Create your first note to get started'
              }
            </p>
            <Button onClick={() => {
              setCurrentNote(null);
              navigate('/app/editor');
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => handleEditNote(note)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {note.title}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {note.isFavorite && (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-red-500 hover:bg-red-50"
                      onClick={(e) => handleDeleteNote(note.id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(note.updatedAt)}
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.value === note.category)?.label || note.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {note.content || 'No content yet...'}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
