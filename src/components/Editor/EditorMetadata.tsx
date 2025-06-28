
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
    <div className="space-y-6">
      {/* Title and Category */}
      <div className="flex gap-4">
        <Input
          placeholder="Enter your brilliant title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-2xl font-bold border-0 bg-white/10 backdrop-blur-sm rounded-2xl focus:bg-white/20 focus:ring-2 focus:ring-blue-200 shadow-soft dark:bg-slate-700/20 dark:focus:bg-slate-600/30 dark:text-slate-200 dark:placeholder-slate-400"
        />
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48 rounded-2xl bg-white/10 backdrop-blur-sm border-0 shadow-soft dark:bg-slate-700/20 dark:text-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-0 dark:text-slate-200">
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="dark:text-slate-200 dark:focus:bg-slate-700/50">
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
            className="bg-white/20 backdrop-blur-sm text-blue-700 border-0 rounded-full px-4 py-2 cursor-pointer hover:bg-white/30 transition-all hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300"
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
            className="w-36 h-8 text-sm border-0 bg-white/10 backdrop-blur-sm rounded-full focus:bg-white/20 dark:bg-slate-500/20 dark:focus:bg-slate-400/30 dark:text-slate-200 dark:placeholder-slate-400"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full h-8 w-8 p-0 hover:bg-white/20 backdrop-blur-sm border-0 dark:hover:bg-slate-700/30"
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
