
import { useNotes } from '../../contexts/NotesContext';
import { useAutoTagging } from '../../hooks/useAutoTagging';
import { useConsolidatedErrorHandler } from '../../hooks/useConsolidatedErrorHandler';
import { 
  validateNoteTitle, 
  validateNoteContent, 
  validateTags, 
  sanitizeText,
  rateLimiter
} from '../../utils/securityUtils';

interface SecureEditorHandlersProps {
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

export const useSecureEditorHandlers = ({
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
}: SecureEditorHandlersProps) => {
  const { createNote, updateNote } = useNotes();
  const { generateTags, isGeneratingTags } = useAutoTagging();
  const { handleError } = useConsolidatedErrorHandler();

  const handleSave = async () => {
    // Rate limiting check
    const userId = currentNote?.user_id || 'anonymous';
    if (!rateLimiter.checkLimit(`save_${userId}`, 30, 60000)) {
      handleError(new Error('Rate limit exceeded'), {
        component: 'SecureEditorHandlers',
        operation: 'handleSave',
        severity: 'medium'
      });
      return;
    }

    // Input validation
    const titleValidation = validateNoteTitle(title);
    if (!titleValidation.isValid) {
      handleError(new Error(titleValidation.error || 'Invalid title'), {
        component: 'SecureEditorHandlers',
        operation: 'validateTitle',
        severity: 'medium'
      });
      return;
    }

    const contentValidation = validateNoteContent(content);
    if (!contentValidation.isValid) {
      handleError(new Error(contentValidation.error || 'Invalid content'), {
        component: 'SecureEditorHandlers',
        operation: 'validateContent',
        severity: 'medium'
      });
      return;
    }

    const tagsValidation = validateTags(tags);
    if (!tagsValidation.isValid) {
      handleError(new Error(tagsValidation.error || 'Invalid tags'), {
        component: 'SecureEditorHandlers',
        operation: 'validateTags',
        severity: 'medium'
      });
      return;
    }

    setIsSaving(true);

    try {
      let finalTags = [...tags];

      // Generate auto-tags only for new notes or when there are no existing tags
      const shouldGenerateTags = !currentNote || tags.length === 0;
      
      if (shouldGenerateTags && (title.trim() || content.trim())) {
        try {
          const autoTags = await generateTags(title, content);
          
          if (autoTags && autoTags.length > 0) {
            const uniqueAutoTags = autoTags.filter(tag => !finalTags.includes(tag));
            finalTags = [...finalTags, ...uniqueAutoTags];
            setTags(finalTags);
          }
        } catch (tagError) {
          handleError(tagError as Error, {
            component: 'SecureEditorHandlers',
            operation: 'generateTags',
            severity: 'low',
            showToast: false
          });
        }
      }

      // Sanitize inputs before saving
      const noteData = {
        title: sanitizeText(title.trim()),
        content: sanitizeText(content.trim()),
        category: sanitizeText(category),
        tags: finalTags.map(tag => sanitizeText(tag)),
        isFavorite,
        color: currentNote?.color || '#64748b',
      };

      if (currentNote) {
        await updateNote(currentNote.id, noteData);
      } else {
        await createNote(noteData);
      }
    } catch (error) {
      handleError(error as Error, {
        component: 'SecureEditorHandlers',
        operation: 'saveNote',
        severity: 'high'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const sanitizedTag = sanitizeText(newTag.trim());
    
    if (!sanitizedTag) {
      handleError(new Error('Tag cannot be empty'), {
        component: 'SecureEditorHandlers',
        operation: 'addTag',
        severity: 'low'
      });
      return;
    }
    
    if (sanitizedTag.length > 50) {
      handleError(new Error('Tag too long (max 50 characters)'), {
        component: 'SecureEditorHandlers',
        operation: 'addTag',
        severity: 'medium'
      });
      return;
    }
    
    if (tags.includes(sanitizedTag)) {
      handleError(new Error('Tag already exists'), {
        component: 'SecureEditorHandlers',
        operation: 'addTag',
        severity: 'low'
      });
      return;
    }
    
    if (tags.length >= 20) {
      handleError(new Error('Maximum 20 tags allowed'), {
        component: 'SecureEditorHandlers',
        operation: 'addTag',
        severity: 'medium'
      });
      return;
    }

    setTags([...tags, sanitizedTag]);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    const suggestionValidation = validateNoteContent(suggestion);
    if (!suggestionValidation.isValid) {
      handleError(new Error('Invalid suggestion content'), {
        component: 'SecureEditorHandlers',
        operation: 'applySuggestion',
        severity: 'medium'
      });
      return;
    }

    const sanitizedSuggestion = sanitizeText(suggestion);
    const updatedContent = content.replace(original, sanitizedSuggestion);
    setContent(updatedContent);
  };

  const handleCollapseAllBars = () => {
    if (isHeaderHidden) {
      setIsHeaderHidden(false);
      setIsAssistantCollapsed(false);
    } else {
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
