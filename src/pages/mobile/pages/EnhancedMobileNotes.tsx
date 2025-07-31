import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedMobileNotes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const mockNotes = [
    {
      id: '1',
      title: 'Project Planning',
      preview: 'Initial planning for the new mobile app project...',
      date: '2024-01-15',
      isFavorite: true,
      category: 'Work'
    },
    {
      id: '2',
      title: 'Meeting Notes',
      preview: 'Notes from the team meeting about upcoming features...',
      date: '2024-01-14',
      isFavorite: false,
      category: 'Work'
    },
    {
      id: '3',
      title: 'Ideas',
      preview: 'Random thoughts and ideas for future projects...',
      date: '2024-01-13',
      isFavorite: true,
      category: 'Personal'
    },
    {
      id: '4',
      title: 'Research Notes',
      preview: 'Findings from user research and competitor analysis...',
      date: '2024-01-12',
      isFavorite: false,
      category: 'Research'
    }
  ];

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'favorites' && note.isFavorite) ||
                         note.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button 
          size="sm"
          onClick={() => navigate('/app/editor')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'favorites', 'work', 'personal', 'research'].map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterOption)}
            className="whitespace-nowrap"
          >
            {filterOption === 'favorites' && <Star className="h-3 w-3 mr-1" />}
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </Button>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <Card 
            key={note.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/app/editor/${note.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">{note.title}</h3>
                {note.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {note.preview}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(note.date).toLocaleDateString()}
                </div>
                <span className="bg-secondary px-2 py-1 rounded-full">
                  {note.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No notes found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/app/editor')}
          >
            Create your first note
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMobileNotes;