import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Save,
  Edit3,
  X,
  Send,
  Sparkles,
  ExternalLink,
  Tag,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIActions } from '@/hooks/useAIActions';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

export interface PreviewNote {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  isNew?: boolean;
}

interface NotePreviewPanelProps {
  note: PreviewNote | null;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onNoteUpdate: (note: PreviewNote) => void;
  onRequestModification: (instruction: string) => void;
  isModifying?: boolean;
  className?: string;
}

export const NotePreviewPanel: React.FC<NotePreviewPanelProps> = ({
  note,
  isVisible,
  onToggleVisibility,
  onNoteUpdate,
  onRequestModification,
  isModifying = false,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [modificationInstruction, setModificationInstruction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const { executeAction } = useAIActions();
  const { toast } = useToast();

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedTags(note.tags);
    }
  }, [note]);

  const handleSaveNote = async () => {
    if (!note) return;
    
    setIsSaving(true);
    try {
      if (note.isNew || !note.id) {
        // Create new note
        const result = await executeAction({
          type: 'create_note',
          data: {
            title: editedTitle,
            content: editedContent,
            tags: editedTags
          }
        });

        if (result.success) {
          const updatedNote = {
            ...note,
            id: result.data.id,
            title: editedTitle,
            content: editedContent,
            tags: editedTags,
            isNew: false
          };
          onNoteUpdate(updatedNote);
          toast.success('Note saved successfully!');
        } else {
          toast.error(result.message || 'Failed to save note');
        }
      } else {
        // Update existing note
        const result = await executeAction({
          type: 'update_note',
          data: {
            note_id: note.id,
            title: editedTitle,
            content: editedContent,
            tags: editedTags
          }
        });

        if (result.success) {
          const updatedNote = {
            ...note,
            title: editedTitle,
            content: editedContent,
            tags: editedTags
          };
          onNoteUpdate(updatedNote);
          toast.success('Note updated successfully!');
        } else {
          toast.error(result.message || 'Failed to update note');
        }
      }
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedTags(note.tags);
    }
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleRequestModification = () => {
    if (modificationInstruction.trim()) {
      onRequestModification(modificationInstruction);
      setModificationInstruction('');
    }
  };

  const handleOpenInEditor = () => {
    if (note?.id) {
      navigate(`/app/editor/${note.id}`);
    }
  };

  if (!isVisible) {
    return (
      <div className={`${className} border-l bg-muted/20`}>
        <div className="p-4 h-full flex items-center justify-center">
          <Button
            variant="outline"
            onClick={onToggleVisibility}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Show Preview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border-l bg-background`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Note Preview</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-8 w-8 p-0"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {note ? (
            <>
              {/* Note Content */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    {isEditing ? (
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Note title..."
                        className="font-semibold"
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md">
                        <h4 className="font-semibold">{note.title}</h4>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Note content..."
                        className="min-h-[200px] resize-none"
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-md min-h-[200px] whitespace-pre-wrap">
                        {note.content}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {editedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTag(tag)}
                              className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="w-3 h-3" />
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
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <Separator />

              {/* AI Modification Request */}
              <div className="p-4 space-y-3 bg-muted/20">
                <label className="text-sm font-medium">Request AI Modification</label>
                <div className="flex gap-2">
                  <Input
                    value={modificationInstruction}
                    onChange={(e) => setModificationInstruction(e.target.value)}
                    placeholder="e.g., Make it more concise, add examples, change tone..."
                    onKeyPress={(e) => e.key === 'Enter' && handleRequestModification()}
                    disabled={isModifying}
                  />
                  <Button
                    onClick={handleRequestModification}
                    disabled={!modificationInstruction.trim() || isModifying}
                    size="sm"
                  >
                    {isModifying ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {isModifying && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    AI is modifying the note...
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="p-4 space-y-3">
                {!isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex-1"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {note.id && (
                      <Button
                        variant="outline"
                        onClick={handleOpenInEditor}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Editor
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? (
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">No Note Selected</h4>
                  <p className="text-sm text-muted-foreground">
                    Ask the AI to create a note and it will appear here for preview and editing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};