
import React, { useState } from 'react';
import { Search, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotes } from '../../contexts/NotesContext';
import { CategoryOption } from '../../types/note';

const categories: CategoryOption[] = [
  { value: 'all', label: 'All Categories', color: 'gray' },
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

const NotesFilters: React.FC = () => {
  const { filteredNotes, filters, setFilters } = useNotes();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

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

  return (
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
  );
};

export default NotesFilters;
