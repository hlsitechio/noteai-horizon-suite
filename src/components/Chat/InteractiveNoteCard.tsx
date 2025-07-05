import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Save, 
  X, 
  ExternalLink, 
  FileText, 
  Tag,
  Plus,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIActions } from '@/hooks/useAIActions';
import { useToast } from '@/hooks/useToast';

interface InteractiveNoteCardProps {
  noteId: string;
  title: string;
  content: string;
  tags: string[];
  onUpdate?: (noteData: { title: string; content: string; tags: string[] }) => void;
}

const InteractiveNoteCard: React.FC<InteractiveNoteCardProps> = ({
  noteId,
  title: initialTitle,
  content: initialContent,
  tags: initialTags,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { executeAction } = useAIActions();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await executeAction({
        type: 'update_note',
        data: {
          note_id: noteId,
          title,
          content,
          tags
        }
      });

      if (result.success) {
        setIsEditing(false);
        onUpdate?.({ title, content, tags });
        toast.success('Note updated successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGoToNote = () => {
    navigate(`/app/editor/${noteId}`);
  };

  return (
    <Card className="mt-3 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-7 text-sm font-semibold"
                placeholder="Note title..."
              />
            ) : (
              <span className="font-semibold">{title}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoToNote}
                  className="h-7 w-7 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                >
                  <Save className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Content */}
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] text-sm"
            placeholder="Note content..."
          />
        ) : (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
            {content.length > 150 ? `${content.substring(0, 150)}...` : content}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs flex items-center gap-1"
              >
                <Tag className="w-2 h-2" />
                {tag}
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(tag)}
                    className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                className="h-7 text-xs flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                className="h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Click edit to modify or external link to open
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToNote}
              className="h-7 text-xs"
            >
              Open Note
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveNoteCard;