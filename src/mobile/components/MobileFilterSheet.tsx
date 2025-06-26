
import React from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '../../contexts/NotesContext';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useNotes();

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'ideas', label: 'Ideas' },
    { value: 'meeting', label: 'Meeting' },
  ];

  const handleCategoryFilter = (category: string) => {
    setFilters({ 
      ...filters, 
      category: filters.category === category ? undefined : category 
    });
  };

  const handleFavoriteFilter = () => {
    setFilters({ 
      ...filters, 
      isFavorite: filters.isFavorite ? undefined : true 
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filter Notes</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={filters.category === cat.value ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => handleCategoryFilter(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <h3 className="font-medium mb-3">Special Filters</h3>
            <Badge
              variant={filters.isFavorite ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={handleFavoriteFilter}
            >
              <Heart className="w-3 h-3 mr-1" />
              Favorites Only
            </Badge>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
