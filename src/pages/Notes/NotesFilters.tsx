
import React, { useState } from 'react';
import { Search, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOptimizedNotes } from '../../contexts/OptimizedNotesContext';
import { CategoryOption } from '../../types/note';
import { Badge } from '@/components/ui/badge';

const categories: CategoryOption[] = [
  { value: 'all', label: 'All Categories', color: 'gray' },
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

const NotesFilters: React.FC = () => {
  const { filteredNotes, filters, setFilters, notes } = useOptimizedNotes();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const favoriteCount = notes.filter(note => note.isFavorite).length;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, searchTerm: value });
  };

  const handleCategoryFilter = (category: string) => {
    setFilters({ 
      ...filters, 
      category: category === 'all' ? '' : category 
    });
  };

  const handleFavoriteFilter = () => {
    setFilters({ 
      ...filters, 
      isFavorite: !filters.isFavorite 
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      searchTerm: '',
      category: '',
      isFavorite: false
    });
  };

  const hasActiveFilters = !!(filters.searchTerm || filters.category || filters.isFavorite);

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Favorites Toggle */}
      <Button
        variant={filters.isFavorite ? "default" : "outline"}
        onClick={handleFavoriteFilter}
        className="flex items-center gap-2"
      >
        <Heart className={`w-4 h-4 ${filters.isFavorite ? 'fill-current' : ''}`} />
        Favorites
        {favoriteCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {favoriteCount}
          </Badge>
        )}
      </Button>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default NotesFilters;
