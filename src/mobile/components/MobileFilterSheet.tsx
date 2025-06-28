
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotes } from '../../contexts/NotesContext';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useNotes();

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category: category === 'all' ? undefined : category });
  };

  const handleFavoriteToggle = (checked: boolean) => {
    setFilters({ ...filters, isFavorite: checked ? true : undefined });
  };

  const clearFilters = () => {
    setFilters({});
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <SheetTitle>Filter Notes</SheetTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <SheetDescription>
            Filter your notes by category and favorites
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label>Category</Label>
            <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="ideas">Ideas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="favorites-filter">Show Favorites Only</Label>
            <Switch
              id="favorites-filter"
              checked={filters.isFavorite === true}
              onCheckedChange={handleFavoriteToggle}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Clear Filters
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
