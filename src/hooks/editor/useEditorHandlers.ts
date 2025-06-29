
import { useNotes } from '../../contexts/NotesContext';
import { useAutoTagging } from '../useAutoTagging';
import { useEditorSecurity } from './useEditorSecurity';
import { EditorState } from './useEditorState';

interface EditorHandlersProps extends EditorState {
  setTags: (tags: string[]) => void;
  setNewTag: (tag: string) => void;
  setContent: (content: string) => void;
  setIsSaving: (saving: boolean) => void;
}

export const useEditorHandlers = (state: EditorHandlersProps) => {
  const { createNote, updateNote } = useNotes();
  const { generateTags, isGeneratingTags } = useAutoTagging();
  const { validateAndSanitize, addTagSecurely, applySuggestionSecurely } = useEditorSecurity();

  const handleSave = async () => {
    const validation = validateAndSanitize({
      title: state.title,
      content: state.content,
      tags: state.tags,
      currentNote: state.currentNote
    });

    if (!validation.isValid) {
      return;
    }

    state.setIsSaving(true);

    try {
      let finalTags = [...state.tags];

      // Generate auto-tags for new notes or when no tags exist
      if ((!state.currentNote || state.tags.length === 0) && (state.title.trim() || state.content.trim())) {
        try {
          const autoTags = await generateTags(state.title, state.content);
          if (autoTags && autoTags.length > 0) {
            const uniqueAutoTags = autoTags.filter(tag => !finalTags.includes(tag));
            finalTags = [...finalTags, ...uniqueAutoTags];
            state.setTags(finalTags);
          }
        } catch (tagError) {
          console.warn('Auto-tagging failed:', tagError);
        }
      }

      const noteData = {
        title: validation.sanitizedData.title,
        content: validation.sanitizedData.content,
        category: validation.sanitizedData.category,
        tags: finalTags,
        isFavorite: state.isFavorite,
        color: state.currentNote?.color || '#64748b',
      };

      if (state.currentNote) {
        await updateNote(state.currentNote.id, noteData);
      } else {
        await createNote(noteData);
      }
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    } finally {
      state.setIsSaving(false);
    }
  };

  const addTag = () => {
    const result = addTagSecurely(state.newTag, state.tags);
    if (result.success) {
      state.setTags(result.updatedTags);
      state.setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    state.setTags(state.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    const result = applySuggestionSecurely(original, suggestion, state.content);
    if (result.success) {
      state.setContent(result.updatedContent);
    }
  };

  return {
    handleSave,
    addTag,
    removeTag,
    handleSuggestionApply,
    isGeneratingTags,
  };
};
