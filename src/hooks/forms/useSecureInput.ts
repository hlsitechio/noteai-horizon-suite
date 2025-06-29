
import { useState, useCallback } from 'react';
import { sanitizeText } from '../../utils/securityUtils';
import { useFormValidation } from './useFormValidation';

export const useSecureInput = (initialValue = '', fieldName = '') => {
  const [value, setValue] = useState(initialValue);
  const { validateField, errors } = useFormValidation();

  const handleChange = useCallback((newValue: string) => {
    const sanitizedValue = sanitizeText(newValue);
    setValue(sanitizedValue);
    
    if (fieldName) {
      validateField(fieldName, sanitizedValue);
    }
  }, [fieldName, validateField]);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    handleChange,
    reset,
    error: fieldName ? errors[fieldName] : undefined,
    isValid: fieldName ? !errors[fieldName] : true,
  };
};
