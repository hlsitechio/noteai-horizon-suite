import React from 'react';
import { ArrowLeft, Save, Star, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import EditorActions from './EditorActions';
import EditorMetadata from './EditorMetadata';

interface EditorHeaderProps {
  title: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  isSaving: boolean;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onTagAdd: () => void;
  onTagRemove: (tag: string) => void;
  onFavoriteToggle: () => void;
  onSave: () => void;
  onFocusModeToggle: () => void;
  onCollapseAllBars: () => void;
  isMobile: boolean;
  isTablet: boolean;
  canSave: boolean;
}

const categories = [
  { value: 'general', label: 'General' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'learning', label: 'Learning' },
  { value: 'brainstorm', label: 'Brainstorm' },
  { value: 'project', label: 'Project' },
];

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  category,
  tags,
  newTag,
  isFavorite,
  isSaving,
  onTitleChange,
  onCategoryChange,
  onNewTagChange,
  onTagAdd,
  onTagRemove,
  onFavoriteToggle,
  onSave,
  onFocusModeToggle,
  onCollapseAllBars,
  isMobile,
  isTablet,
  canSave
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/app/notes');
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onFavoriteToggle}
            className={isFavorite ? 'text-yellow-500' : ''}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onFocusModeToggle}
            className="text-purple-600"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave}
            disabled={isSaving || !canSave}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <EditorActions
          onSave={onSave}
          onFocusModeToggle={onFocusModeToggle}
          onCollapseAllBars={onCollapseAllBars}
          isSaving={isSaving}
          canSave={canSave}
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Input
          placeholder="Enter your brilliant title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-2xl font-bold border-none px-0 shadow-none focus-visible:ring-0 bg-transparent"
        />
      </div>

      {/* Metadata */}
      <EditorMetadata
        category={category}
        tags={tags}
        newTag={newTag}
        isFavorite={isFavorite}
        onCategoryChange={onCategoryChange}
        onNewTagChange={onNewTagChange}
        onTagAdd={onTagAdd}
        onTagRemove={onTagRemove}
        onFavoriteToggle={onFavoriteToggle}
        categories={categories}
      />
    </div>
  );
};

export default EditorHeader;