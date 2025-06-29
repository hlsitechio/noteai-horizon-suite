
import { useState } from 'react';
import { validateNoteTitle, validateNoteContent, validateTags } from '../../utils/securityUtils';

export interface FormValidation {
  errors: Record<string, string>;
  isValid: boolean;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any): boolean => {
    const newErrors = { ...errors };

    switch (field) {
      case 'title':
        const titleValidation = validateNoteTitle(value);
        if (!titleValidation.isValid) {
          newErrors.title = titleValidation.error || 'Invalid title';
        } else {
          delete newErrors.title;
        }
        break;

      case 'content':
        const contentValidation = validateNoteContent(value);
        if (!contentValidation.isValid) {
          newErrors.content = contentValidation.error || 'Invalid content';
        } else {
          delete newErrors.content;
        }
        break;

      case 'tags':
        const tagsValidation = validateTags(value);
        if (!tagsValidation.isValid) {
          newErrors.tags = tagsValidation.error || 'Invalid tags';
        } else {
          delete newErrors.tags;
        }
        break;
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateAll = (data: Record<string, any>): FormValidation => {
    let isValid = true;
    const allErrors: Record<string, string> = {};

    Object.keys(data).forEach(field => {
      if (!validateField(field, data[field])) {
        isValid = false;
        allErrors[field] = errors[field];
      }
    });

    return { errors: allErrors, isValid };
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    isValid: Object.keys(errors).length === 0,
  };
};
