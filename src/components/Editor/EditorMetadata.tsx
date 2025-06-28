
import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryOption } from '../../types/note';

interface EditorMetadataProps {
  title: string;
  category: string;
  tags: string[];
  newTag: string;
  categories: CategoryOption[];
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const EditorMetadata: React.FC<EditorMetadataProps> = ({
  title,
  category,
  tags,
  newTag,
  categories,
  onTitleChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 border-b border-gray-200">
      {/* Title and Category */}
      <div className="flex gap-4">
        <Input
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl font-semibold"
        />
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
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
      <div className="flex gap-2 flex-wrap items-center">
        {tags.map((tag) => (
          <Badge 
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-gray-300"
            onClick={() => onRemoveTag(tag)}
          >
            #{tag} ×
          </Badge>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add tag..."
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-36 h-8 text-sm"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={onAddTag}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorMetadata;
