import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Share, MoreHorizontal, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNotes } from '@/contexts/NotesContext';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import MobileEditorToolbar from '../components/MobileEditorToolbar';
import { supabase } from '@/integrations/supabase/client';

const MobileEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { notes, createNote, updateNote } = useNotes();
  
  const noteId = searchParams.get('id');
  const existingNote = noteId ? notes.find(n => n.id === noteId) : null;
  
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Get current user for sync
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || 'anonymous');
    };
    getUser();
  }, []);

  // Real-time sync hook
  const { connected, activeUsers, updateContent: updateSyncContent, sendNoteUpdate } = useRealtimeSync({
    documentId: noteId || 'new-note',
    userId,
    enabled: !!noteId, // Only enable sync for existing notes
    onContentChange: (syncedContent) => {
      if (syncedContent !== content) {
        setContent(syncedContent);
        toast({
          title: "Content updated",
          description: "Note was updated from another device",
        });
      }
    }
  });
  
  useEffect(() => {
    const hasChanges = title !== (existingNote?.title || '') || 
                      content !== (existingNote?.content || '');
    setIsChanged(hasChanges);
  }, [title, content, existingNote]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (existingNote) {
        await updateNote(existingNote.id, {
          title: title.trim(),
          content: content.trim(),
          tags
        });
        toast({
          title: "Note updated",
          description: "Your changes have been saved successfully"
        });
      } else {
        await createNote({
          title: title.trim(),
          content: content.trim(),
          tags,
          category: 'general',
          isFavorite: false
        });
        toast({
          title: "Note created",
          description: "Your new note has been saved successfully"
        });
      }
      setIsChanged(false);
      navigate('/mobile/notes');
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (isChanged) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/mobile/notes');
  };

  const handleShare = () => {
    if (navigator.share && title && content) {
      navigator.share({
        title: title,
        text: content
      }).catch(() => {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${title}\n\n${content}`);
        toast({
          title: "Copied to clipboard",
          description: "Note content has been copied to your clipboard"
        });
      });
    } else {
      navigator.clipboard.writeText(`${title}\n\n${content}`);
      toast({
        title: "Copied to clipboard",
        description: "Note content has been copied to your clipboard"
      });
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-9 w-9 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Mobile Editor
              {/* Sync status indicator */}
              {connected ? (
                <Wifi className="h-4 w-4 text-green-500" aria-label="Connected to real-time sync" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" aria-label="Disconnected from real-time sync" />
              )}
              {activeUsers.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {activeUsers.length} users
                </Badge>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={!title && !content}
              className="h-9 w-9 p-0"
            >
              <Share className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!isChanged || isSaving}
              size="sm"
              className="h-9"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Toolbar */}
      <MobileEditorToolbar />

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title Input */}
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Content Textarea */}
        <Textarea
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            // Send real-time update to other devices
            if (noteId) {
              sendNoteUpdate(noteId, e.target.value);
            }
          }}
          className="min-h-[60vh] border-none p-0 resize-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addTag('important')}
            disabled={tags.includes('important')}
          >
            + Important
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addTag('todo')}
            disabled={tags.includes('todo')}
          >
            + Todo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addTag('idea')}
            disabled={tags.includes('idea')}
          >
            + Idea
          </Button>
        </div>

        {/* Bottom spacing for mobile keyboard */}
        <div className="h-20" />
      </div>

      {/* Status indicator */}
      {isChanged && (
        <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm">
          <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-lg text-sm text-center">
            You have unsaved changes
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileEditor;