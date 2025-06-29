
import { useConsolidatedErrorHandler } from '../useConsolidatedErrorHandler';
import { 
  validateNoteTitle, 
  validateNoteContent, 
  validateTags, 
  sanitizeText,
  rateLimiter
} from '../../utils/securityUtils';

interface ValidationData {
  title: string;
  content: string;
  tags: string[];
  currentNote?: any;
}

interface ValidationResult {
  isValid: boolean;
  sanitizedData: {
    title: string;
    content: string;
    category: string;
  };
}

export const useEditorSecurity = () => {
  const { handleError } = useConsolidatedErrorHandler();

  const validateAndSanitize = (data: ValidationData): ValidationResult => {
    const userId = data.currentNote?.user_id || 'anonymous';
    
    // Rate limiting
    if (!rateLimiter.checkLimit(`save_${userId}`, 30, 60000)) {
      handleError(new Error('Rate limit exceeded'), {
        component: 'EditorSecurity',
        operation: 'validateAndSanitize',
        severity: 'medium'
      });
      return { isValid: false, sanitizedData: { title: '', content: '', category: '' } };
    }

    // Title validation
    const titleValidation = validateNoteTitle(data.title);
    if (!titleValidation.isValid) {
      handleError(new Error(titleValidation.error || 'Invalid title'), {
        component: 'EditorSecurity',
        operation: 'validateTitle',
        severity: 'medium'
      });
      return { isValid: false, sanitizedData: { title: '', content: '', category: '' } };
    }

    // Content validation
    const contentValidation = validateNoteContent(data.content);
    if (!contentValidation.isValid) {
      handleError(new Error(contentValidation.error || 'Invalid content'), {
        component: 'EditorSecurity',
        operation: 'validateContent',
        severity: 'medium'
      });
      return { isValid: false, sanitizedData: { title: '', content: '', category: '' } };
    }

    // Tags validation
    const tagsValidation = validateTags(data.tags);
    if (!tagsValidation.isValid) {
      handleError(new Error(tagsValidation.error || 'Invalid tags'), {
        component: 'EditorSecurity',
        operation: 'validateTags',
        severity: 'medium'
      });
      return { isValid: false, sanitizedData: { title: '', content: '', category: '' } };
    }

    return {
      isValid: true,
      sanitizedData: {
        title: sanitizeText(data.title.trim()),
        content: sanitizeText(data.content.trim()),
        category: sanitizeText('general'), // Default category
      }
    };
  };

  const addTagSecurely = (newTag: string, existingTags: string[]) => {
    const sanitizedTag = sanitizeText(newTag.trim());
    
    if (!sanitizedTag) {
      handleError(new Error('Tag cannot be empty'), {
        component: 'EditorSecurity',
        operation: 'addTag',
        severity: 'low'
      });
      return { success: false, updatedTags: existingTags };
    }
    
    if (sanitizedTag.length > 50) {
      handleError(new Error('Tag too long (max 50 characters)'), {
        component: 'EditorSecurity',
        operation: 'addTag',
        severity: 'medium'
      });
      return { success: false, updatedTags: existingTags };
    }
    
    if (existingTags.includes(sanitizedTag)) {
      handleError(new Error('Tag already exists'), {
        component: 'EditorSecurity',
        operation: 'addTag',
        severity: 'low'
      });
      return { success: false, updatedTags: existingTags };
    }
    
    if (existingTags.length >= 20) {
      handleError(new Error('Maximum 20 tags allowed'), {
        component: 'EditorSecurity',
        operation: 'addTag',
        severity: 'medium'
      });
      return { success: false, updatedTags: existingTags };
    }

    return { success: true, updatedTags: [...existingTags, sanitizedTag] };
  };

  const applySuggestionSecurely = (original: string, suggestion: string, content: string) => {
    const suggestionValidation = validateNoteContent(suggestion);
    if (!suggestionValidation.isValid) {
      handleError(new Error('Invalid suggestion content'), {
        component: 'EditorSecurity',
        operation: 'applySuggestion',
        severity: 'medium'
      });
      return { success: false, updatedContent: content };
    }

    const sanitizedSuggestion = sanitizeText(suggestion);
    const updatedContent = content.replace(original, sanitizedSuggestion);
    
    return { success: true, updatedContent };
  };

  return {
    validateAndSanitize,
    addTagSecurely,
    applySuggestionSecurely,
  };
};
