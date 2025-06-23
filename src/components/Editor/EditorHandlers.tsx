
import { useNotes } from '../../contexts/NotesContext';
import { useAutoTagging } from '../../hooks/useAutoTagging';
import { toast } from 'sonner';

interface EditorHandlersProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  currentNote: any;
  setTags: (tags: string[]) => void;
  setNewTag: (tag: string) => void;
  setContent: (content: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsHeaderHidden: (hidden: boolean) => void;
  setIsAssistantCollapsed: (collapsed: boolean) => void;
  isHeaderHidden: boolean;
}

export const useEditorHandlers = ({
  title,
  content,
  category,
  tags,
  newTag,
  isFavorite,
  currentNote,
  setTags,
  setNewTag,
  setContent,
  setIsSaving,
  setIsHeaderHidden,
  setIsAssistantCollapsed,
  isHeaderHidden,
}: EditorHandlersProps) => {
  const { createNote, updateNote } = useNotes();
  const { generateTags, isGeneratingTags } = useAutoTagging();

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      let finalTags = [...tags];

      // Generate auto-tags only for new notes or when there are no existing tags
      const shouldGenerateTags = !currentNote || tags.length === 0;
      
      if (shouldGenerateTags && (title.trim() || content.trim())) {
        try {
          toast.info('Generating tags automatically...', { duration: 2000 });
          const autoTags = await generateTags(title, content);
          
          if (autoTags && autoTags.length > 0) {
            // Merge auto-generated tags with existing tags, avoiding duplicates
            const uniqueAutoTags = autoTags.filter(tag => !finalTags.includes(tag));
            finalTags = [...finalTags, ...uniqueAutoTags];
            
            // Update the tags state so user can see the generated tags
            setTags(finalTags);
            
            toast.success(`Generated ${uniqueAutoTags.length} new tags automatically`);
          }
        } catch (tagError) {
          console.error('Auto-tagging failed:', tagError);
          // Continue with save even if auto-tagging fails
        }
      }

      const noteData = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: finalTags,
        isFavorite,
        color: currentNote?.color || '#64748b',
      };

      if (currentNote) {
        await updateNote(currentNote.id, noteData);
      } else {
        await createNote(noteData);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    // Simple text replacement for demonstration
    const updatedContent = content.replace(original, suggestion);
    setContent(updatedContent);
  };

  const handleCollapseAllBars = () => {
    if (isHeaderHidden) {
      // Currently collapsed - show all bars
      setIsHeaderHidden(false);
      setIsAssistantCollapsed(false);
    } else {
      // Currently expanded - collapse all bars
      setIsHeaderHidden(true);
      setIsAssistantCollapsed(true);
    }
  };

  return {
    handleSave,
    addTag,
    removeTag,
    handleSuggestionApply,
    handleCollapseAllBars,
    isGeneratingTags,
  };
};
