import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Save, MoreVertical, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import MobileEditorToolbar from '../components/MobileEditorToolbar';
import RichTextEditor from '../../components/Editor/RichTextEditor';
import { useEditorFormatting } from '../../components/Editor/hooks/useEditorFormatting';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { toast } from 'sonner';

const MobileEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');
  const { currentNote, updateNote, notes, setCurrentNote, toggleFavorite } = useNotes();
  const [title, setTitle] = useState(currentNote?.title || '');
  const [content, setContent] = useState(currentNote?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showRichEditor, setShowRichEditor] = useState(false);
  
  // Create Slate editor for formatting
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  const { handleFormatClick, getActiveFormats } = useEditorFormatting(editor);
  
  // Refs for focusing
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load note from URL parameter if available
  useEffect(() => {
    if (noteId && (!currentNote || currentNote.id !== noteId)) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
        setTitle(note.title);
        setContent(note.content);
      }
    }
  }, [noteId, notes, currentNote, setCurrentNote]);

  // Update local state when currentNote changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setHasChanges(false);
    }
  }, [currentNote]);

  // Track changes
  useEffect(() => {
    if (currentNote) {
      const hasChanged = title !== currentNote.title || content !== currentNote.content;
      setHasChanges(hasChanged);
    }
  }, [title, content, currentNote]);

  const handleSave = async () => {
    if (!currentNote) return;
    
    setIsSaving(true);
    try {
      await updateNote(currentNote.id, { title, content });
      setHasChanges(false);
      toast.success('Note saved!');
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentNote) return;
    
    try {
      await toggleFavorite(currentNote.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      // Auto-save before leaving
      handleSave();
    }
    navigate('/mobile/notes');
  };

  const handleShare = () => {
    if (navigator.share && currentNote) {
      navigator.share({
        title: currentNote.title,
        text: currentNote.content,
      }).catch(console.error);
    } else {
      toast.info('Share feature not supported on this device');
    }
  };

  // Handle mobile keyboard focus
  const handleTextareaClick = () => {
    // Small delay to ensure the click event is processed first
    setTimeout(() => {
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
        // For iOS, this helps ensure the keyboard appears
        contentTextareaRef.current.click();
      }
    }, 100);
  };

  const handleTitleClick = () => {
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.click();
      }
    }, 100);
  };

  if (!currentNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No note selected</h2>
          <p className="text-muted-foreground mb-4">
            Select a note to start editing or create a new one
          </p>
          <Button onClick={() => navigate('/mobile/notes')}>
            Go to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Mobile Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleToggleFavorite}
            className={currentNote.isFavorite ? 'text-yellow-500' : ''}
          >
            <Star className={`w-4 h-4 ${currentNote.isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Title Input */}
        <Input
          ref={titleInputRef}
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={handleTitleClick}
          className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
        />
        
        {/* Rich Text Editor Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={showRichEditor ? "default" : "outline"}
            size="sm"
            onClick={() => setShowRichEditor(!showRichEditor)}
            className="text-xs"
          >
            {showRichEditor ? "Simple Editor" : "Rich Editor"}
          </Button>
        </div>

        {/* Content Editor */}
        {showRichEditor ? (
          <div className="flex-1 min-h-0">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your note..."
              canSave={true}
              isSaving={isSaving}
            />
          </div>
        ) : (
          <textarea
            ref={contentTextareaRef}
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={handleTextareaClick}
            onTouchStart={handleTextareaClick}
            className="flex-1 resize-none border-none px-0 shadow-none focus-visible:ring-0 text-base leading-relaxed bg-transparent"
            autoFocus={false}
          />
        )}
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground border-t">
          Unsaved changes
        </div>
      )}

      {/* Mobile Toolbar - Only show for rich editor */}
      {showRichEditor && (
        <MobileEditorToolbar 
          onFormatClick={handleFormatClick}
          activeFormats={getActiveFormats()}
        />
      )}
    </div>
  );
};

export default MobileEditor;
