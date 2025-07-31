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

export interface NotePreviewPanelProps {
  note: PreviewNote | null;
  onToggleVisibility: () => void;
  onNoteUpdate: (note: PreviewNote) => void;
  onRequestModification: (instruction: string) => void;
  isModifying?: boolean;
  className?: string;
}

export const NotePreviewPanel: React.FC<NotePreviewPanelProps> = ({
  note,
  onToggleVisibility,
  onNoteUpdate,
  onRequestModification,
  isModifying = false,
  className = ''
}) => {
  // Use local state for visibility
  const [isVisible, setIsVisible] = React.useState(true);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    onToggleVisibility();
  };
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
      <div className={`${className} border-l border-border/30 bg-gradient-to-br from-background via-muted/5 to-primary/5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="relative p-8 h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 via-accent/15 to-primary/25 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30 shadow-2xl">
                <Eye className="w-10 h-10 text-primary drop-shadow-lg" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
            </div>
              <Button
                variant="outline"
                onClick={handleToggleVisibility}
              className="group h-14 px-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-background/80 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-500 shadow-2xl hover:shadow-primary/20 backdrop-blur-sm"
            >
              <Eye className="w-6 h-6 text-primary mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Show Canva</span>
            </Button>
            <p className="text-sm text-muted-foreground/80 font-medium max-w-48 leading-relaxed">
              Open the interactive note workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border-l border-border/30 bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-60"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/8 rounded-full blur-2xl"></div>
      
      <div className="relative h-full flex flex-col backdrop-blur-sm">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 via-accent/8 to-primary/10 backdrop-blur-lg shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/40 shadow-xl">
                  <FileText className="w-6 h-6 text-primary drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-primary rounded-full animate-pulse shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-primary/50 rounded-full animate-ping"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Note Canva
                </h3>
                <p className="text-sm text-muted-foreground/80 font-medium">
                  Interactive editing workspace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVisibility}
                className="h-10 w-10 p-0 rounded-2xl hover:bg-muted/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-border/30"
              >
                <EyeOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {note ? (
            <>
              {/* Enhanced Note Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Title
                    </label>
                    {isEditing ? (
                      <Input
                        id="note-title-edit"
                        name="noteTitle"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Note title..."
                        className="font-semibold text-lg h-12 rounded-xl border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-r from-background to-muted/10"
                      />
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border border-muted/50 backdrop-blur-sm">
                        <h4 className="font-bold text-lg text-foreground">{note.title}</h4>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      Content
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Note content..."
                        className="min-h-[240px] resize-none rounded-xl border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-br from-background to-muted/10 text-base leading-relaxed"
                      />
                    ) : (
                      <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/20 rounded-xl border border-muted/50 min-h-[240px] whitespace-pre-wrap text-base leading-relaxed backdrop-blur-sm">
                        {note.content}
                      </div>
                    )}
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editedTags.map((tag, index) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-secondary/80 to-secondary/60 hover:from-secondary to-secondary/80 transition-all duration-200">
                          <Tag className="w-3 h-3" />
                          <span className="font-medium">{tag}</span>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTag(tag)}
                              className="h-5 w-5 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all duration-200"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    
                    {isEditing && (
                      <div className="flex gap-3 mt-3">
                        <Input
                          id="new-tag-input"
                          name="newTag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add tag..."
                          className="flex-1 h-10 rounded-lg border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-r from-background to-muted/10"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                          className="h-10 w-10 rounded-lg border-2 border-muted/50 hover:border-primary/50 transition-all duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <Separator />

              {/* Enhanced AI Modification Request */}
              <div className="p-6 space-y-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm border-t border-border/50">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Request AI Modification
                </label>
                <div className="flex gap-3">
                  <Input
                    id="modification-instruction"
                    name="modificationInstruction"
                    value={modificationInstruction}
                    onChange={(e) => setModificationInstruction(e.target.value)}
                    placeholder="e.g., Make it more concise, add examples, change tone..."
                    onKeyPress={(e) => e.key === 'Enter' && handleRequestModification()}
                    disabled={isModifying}
                    className="h-11 rounded-xl border-2 border-muted/50 focus:border-primary/50 bg-gradient-to-r from-background to-muted/10"
                  />
                  <Button
                    onClick={handleRequestModification}
                    disabled={!modificationInstruction.trim() || isModifying}
                    size="lg"
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isModifying ? (
                      <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span className="font-medium">Modify</span>
                      </div>
                    )}
                  </Button>
                </div>
                {isModifying && (
                  <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 animate-fade-in">
                    <div className="relative">
                      <Sparkles className="w-5 h-5 animate-spin text-primary" />
                      <div className="absolute inset-0 w-5 h-5 text-primary/30 animate-ping">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-sm text-primary font-medium">AI is modifying the note...</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Enhanced Actions */}
              <div className="p-6 space-y-4 border-t border-border/50">
                {!isEditing ? (
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="w-full h-12 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-background to-primary/5 hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
                    >
                      <Edit3 className="w-5 h-5 mr-3" />
                      <span className="font-medium">Edit Note</span>
                    </Button>
                    {note.id && (
                      <Button
                        variant="outline"
                        onClick={handleOpenInEditor}
                        className="w-full h-12 rounded-xl border-2 border-accent/20 bg-gradient-to-r from-background to-accent/5 hover:from-accent/5 hover:to-accent/10 transition-all duration-300"
                      >
                        <ExternalLink className="w-5 h-5 mr-3" />
                        <span className="font-medium">Open in Editor</span>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveNote}
                      disabled={isSaving}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSaving ? (
                        <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5 mr-3" />
                      )}
                      <span className="font-medium">Save</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="h-12 w-12 rounded-xl border-2 border-muted/50 hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center">
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20">
                    <FileText className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    No Note in Canva
                  </h4>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Ask the AI to create a note in the canva and it will appear here for real-time editing and collaboration.
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