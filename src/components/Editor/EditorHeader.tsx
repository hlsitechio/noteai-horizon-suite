
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Star, StarOff, Plus, X } from 'lucide-react';
import { Note, NoteCategory } from '../../types/note';
import ReminderButton from './ReminderButton';

interface EditorHeaderProps {
  note: Note | null;
  title: string;
  category: string;
  tags: string[];
  newTag: string;
  isEditing: boolean;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onNewTagChange: (tag: string) => void;
  onToggleFavorite: () => void;
}

const categories: { value: NoteCategory; label: string; color: string }[] = [
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
  { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
  { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
  { value: 'ideas', label: 'Ideas', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'todo', label: 'To-Do', color: 'bg-red-100 text-red-800' },
  { value: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-800' },
  { value: 'learning', label: 'Learning', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'bg-pink-100 text-pink-800' },
  { value: 'project', label: 'Project', color: 'bg-teal-100 text-teal-800' },
  { value: 'reminder', label: 'Reminder', color: 'bg-orange-100 text-orange-800' },
];

const EditorHeader: React.FC<EditorHeaderProps> = ({
  note,
  title,
  category,
  tags,
  newTag,
  isEditing,
  isSaving,
  onBack,
  onSave,
  onTitleChange,
  onCategoryChange,
  onTagsChange,
  onNewTagChange,
  onToggleFavorite,
}) => {
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      onNewTagChange('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const isReminderCategory = category === 'reminder';

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFavorite}
              className="p-2"
            >
              {note?.isFavorite ? (
                <StarOff className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="w-4 h-4" />
              )}
            </Button>
            
            <ReminderButton 
              note={note} 
              isVisible={isReminderCategory} 
            />
          </div>
        </div>

        <Button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>

      <div className="px-4 pb-4 space-y-4">
        <Input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tags:</span>
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => onNewTagChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-24 h-6 text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddTag}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
