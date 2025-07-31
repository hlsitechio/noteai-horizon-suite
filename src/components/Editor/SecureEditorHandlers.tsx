
import { useNotes } from '../../contexts/NotesContext';
import { useAutoTagging } from '../../hooks/useAutoTagging';
import { useToast } from '../../hooks/useToast';
import { 
  validateNoteTitle, 
  validateNoteContent, 
  validateTags, 
  sanitizeText,
  secureLog,
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
  const { toast } = useToast();

  const handleSave = async () => {
    // Rate limiting check
    const userId = currentNote?.user_id || 'anonymous';
    if (!rateLimiter.checkLimit(`save_${userId}`, 30, 60000)) {
      toast.error('Too many save attempts. Please wait a moment.');
      return;
    }

    // Input validation
    const titleValidation = validateNoteTitle(title);
    if (!titleValidation.isValid) {
      toast.error(titleValidation.error || 'Invalid title');
      return;
    }

    const contentValidation = validateNoteContent(content);
    if (!contentValidation.isValid) {
      toast.error(contentValidation.error || 'Invalid content');
      return;
    }

    const tagsValidation = validateTags(tags);
    if (!tagsValidation.isValid) {
      toast.error(tagsValidation.error || 'Invalid tags');
      return;
    }

    setIsSaving(true);
    
    // Secure logging - don't log full content
    secureLog.info('Starting save process', { 
      titleLength: title.length,
      isNewNote: !currentNote,
      tagCount: tags.length,
      contentLength: content.length
    });

    try {
      let finalTags = [...tags];

      // Generate auto-tags only for new notes or when there are no existing tags
      const shouldGenerateTags = !currentNote || tags.length === 0;
      
      if (shouldGenerateTags && (title.trim() || content.trim())) {
        try {
          secureLog.info('Attempting to generate tags');
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
          secureLog.error('Auto-tagging failed', tagError);
          toast.error('Auto-tagging failed, but note will still be saved');
          // Continue with save even if auto-tagging fails
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
        secureLog.info('Note updated successfully');
        toast.success('Note updated successfully');
      } else {
        await createNote(noteData);
        secureLog.info('Note created successfully');
        toast.success('Note created successfully');
      }
    } catch (error) {
      secureLog.error('Error saving note', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const sanitizedTag = sanitizeText(newTag.trim());
    
    if (!sanitizedTag) {
      toast.error('Tag cannot be empty');
      return;
    }
    
    if (sanitizedTag.length > 50) {
      toast.error('Tag too long (max 50 characters)');
      return;
    }
    
    if (tags.includes(sanitizedTag)) {
      toast.error('Tag already exists');
      return;
    }
    
    if (tags.length >= 20) {
      toast.error('Maximum 20 tags allowed');
      return;
    }

    setTags([...tags, sanitizedTag]);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    // Validate suggestion before applying
    const suggestionValidation = validateNoteContent(suggestion);
    if (!suggestionValidation.isValid) {
      toast.error('Invalid suggestion content');
      return;
    }

    // Simple text replacement with sanitization
    const sanitizedSuggestion = sanitizeText(suggestion);
    const updatedContent = content.replace(original, sanitizedSuggestion);
    setContent(updatedContent);
    
    secureLog.info('Applied writing suggestion');
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
