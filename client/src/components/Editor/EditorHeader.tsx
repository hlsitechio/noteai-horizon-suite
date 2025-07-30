
import React from 'react';
import { ArrowLeft, Save, Star, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface EditorHeaderProps {
  note?: any;
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
  onFocusModeToggle?: () => void;
}

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
  onFocusModeToggle,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/app/notes');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur-sm border-b border-border p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Focus Mode Button */}
          {onFocusModeToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFocusModeToggle}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none hover:from-purple-600 hover:to-blue-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Focus Mode
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={note?.isFavorite ? 'text-yellow-500' : ''}
          >
            <Star className={`w-4 h-4 ${note?.isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            onClick={onSave}
            disabled={!title.trim() || isSaving}
            size="sm"
            className="bg-primary text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="ideas">Ideas</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tags:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {tags.map((tag, index) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newTag.trim() && !tags.includes(newTag.trim())) {
                    onTagsChange([...tags, newTag.trim()]);
                    onNewTagChange('');
                  }
                }
              }}
              className="w-24 h-6 text-xs border-none shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditorHeader;
