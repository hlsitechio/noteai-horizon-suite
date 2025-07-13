import React from 'react';
import { Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface EditorMetadataProps {
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onTagAdd: () => void;
  onTagRemove: (tag: string) => void;
  onFavoriteToggle: () => void;
  categories: Array<{ value: string; label: string }>;
}

const EditorMetadata: React.FC<EditorMetadataProps> = ({
  category,
  tags,
  newTag,
  isFavorite,
  onCategoryChange,
  onNewTagChange,
  onTagAdd,
  onTagRemove,
  onFavoriteToggle,
  categories,
}) => {
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onTagAdd();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 py-2 border-b border-border/30">
      {/* Category */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Category:</span>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-32 border-border/30">
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
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tags:</span>
        <div className="flex items-center gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => onTagRemove(tag)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          <div className="flex items-center gap-1">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="w-24 h-6 text-xs border-border/30"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={onTagAdd}
              disabled={!newTag.trim()}
              className="h-6 w-6 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Favorite Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFavoriteToggle}
        className={`flex items-center gap-1 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? 'Favorited' : 'Add to Favorites'}
      </Button>
    </div>
  );
};

export default EditorMetadata;