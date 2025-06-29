
import React, { useEffect } from 'react';
import { Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { useMobileNavigation } from '../../hooks/mobile/useMobileNavigation';
import { useEditorState } from '../../hooks/editor/useEditorState';
import { useEditorHandlers } from '../../hooks/editor/useEditorHandlers';
import MobileLayout from '../../components/shared/MobileLayout';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import MobileEditorToolbar from '../components/MobileEditorToolbar';
import { toast } from 'sonner';

const MobileEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('note');
  const { notes, setCurrentNote, toggleFavorite } = useNotes();
  const { navigateToNotes } = useMobileNavigation();
  
  // Use refactored hooks
  const editorState = useEditorState();
  const editorHandlers = useEditorHandlers(editorState);
  
  const [hasChanges, setHasChanges] = React.useState(false);

  // Load note from URL parameter if available
  useEffect(() => {
    if (noteId && (!editorState.currentNote || editorState.currentNote.id !== noteId)) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
      }
    }
  }, [noteId, notes, editorState.currentNote, setCurrentNote]);

  // Track changes
  useEffect(() => {
    if (editorState.currentNote) {
      const hasChanged = editorState.title !== editorState.currentNote.title || 
                        editorState.content !== editorState.currentNote.content;
      setHasChanges(hasChanged);
    }
  }, [editorState.title, editorState.content, editorState.currentNote]);

  const handleToggleFavorite = async () => {
    if (!editorState.currentNote) return;
    
    try {
      await toggleFavorite(editorState.currentNote.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      editorHandlers.handleSave();
    }
    navigateToNotes();
  };

  const handleShare = () => {
    if (navigator.share && editorState.currentNote) {
      navigator.share({
        title: editorState.currentNote.title,
        text: editorState.currentNote.content,
      }).catch(console.error);
    } else {
      toast.info('Share feature not supported on this device');
    }
  };

  if (!editorState.currentNote) {
    return (
      <MobileLayout title="Editor" onBack={navigateToNotes}>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-lg font-semibold mb-2">No note selected</h2>
          <p className="text-muted-foreground mb-4">
            Select a note to start editing or create a new one
          </p>
          <Button onClick={navigateToNotes}>
            Go to Notes
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const rightActions = (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleToggleFavorite}
        className={editorState.currentNote.isFavorite ? 'text-yellow-500' : ''}
      >
        <Star className={`w-4 h-4 ${editorState.currentNote.isFavorite ? 'fill-current' : ''}`} />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={editorHandlers.handleSave}
        disabled={editorState.isSaving || !hasChanges}
      >
        {editorState.isSaving ? <LoadingSpinner size="sm" className="mr-1" /> : null}
        {editorState.isSaving ? 'Saving...' : 'Save'}
      </Button>
    </>
  );

  return (
    <MobileLayout 
      title="Editor" 
      onBack={handleBack}
      rightActions={rightActions}
    >
      {/* Editor Content */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Title Input */}
        <Input
          placeholder="Note title..."
          value={editorState.title}
          onChange={(e) => editorState.setTitle(e.target.value)}
          className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
        />
        
        {/* Content Textarea */}
        <Textarea
          placeholder="Start writing your note..."
          value={editorState.content}
          onChange={(e) => editorState.setContent(e.target.value)}
          className="flex-1 resize-none border-none px-0 shadow-none focus-visible:ring-0 text-base leading-relaxed"
        />
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground border-t">
          Unsaved changes
        </div>
      )}

      {/* Mobile Toolbar */}
      <MobileEditorToolbar />
    </MobileLayout>
  );
};

export default MobileEditor;
