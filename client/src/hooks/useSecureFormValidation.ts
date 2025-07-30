import { useState, useCallback } from 'react';
import { validateAdvancedText, validateEmailAdvanced, validateUrl, ValidationResult } from '@/utils/advancedInputValidation';
import { useSecurityMonitoring } from './useSecurityMonitoring';

interface FormField {
  name: string;
  value: string;
  validation: ValidationResult;
  isDirty: boolean;
}

interface ValidationConfig {
  required?: boolean;
  maxLength?: number;
  allowEmpty?: boolean;
  allowHtml?: boolean;
  strictMode?: boolean;
  type?: 'text' | 'email' | 'url' | 'textarea';
}

export const useSecureFormValidation = (formName: string) => {
  const [fields, setFields] = useState<Record<string, FormField>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { monitorFormValidation, detectSuspiciousActivity } = useSecurityMonitoring();

  const validateField = useCallback((
    name: string,
    value: string,
    config: ValidationConfig = {}
  ): ValidationResult => {
    const { type = 'text', required = false, ...validationOptions } = config;

    // Check if field is required and empty
    if (required && !value.trim()) {
      return { isValid: false, error: 'This field is required' };
    }

    // Skip validation for empty non-required fields
    if (!required && !value.trim()) {
      return { isValid: true, sanitized: '' };
    }

    // Validate based on field type
    switch (type) {
      case 'email':
        return validateEmailAdvanced(value);
      case 'url':
        return validateUrl(value);
      case 'text':
      case 'textarea':
      default:
        return validateAdvancedText(value, validationOptions);
    }
  }, []);

  const setFieldValue = useCallback((
    name: string,
    value: string,
    config: ValidationConfig = {}
  ) => {
    const validation = validateField(name, value, config);
    
    setFields(prev => ({
      ...prev,
      [name]: {
        name,
        value,
        validation,
        isDirty: true,
      },
    }));

    // Monitor for suspicious activity
    if (validation.threats && validation.threats.length > 0) {
      detectSuspiciousActivity('malicious_input_attempt', {
        fieldName: name,
        threats: validation.threats,
        value: value.substring(0, 100), // Log only first 100 chars
      });
    }
  }, [validateField, detectSuspiciousActivity]);

  const validateForm = useCallback((
    fieldConfigs: Record<string, ValidationConfig>
  ): boolean => {
    const errors: string[] = [];
    const updatedFields = { ...fields };

    // Validate all fields
    for (const [fieldName, config] of Object.entries(fieldConfigs)) {
      const fieldValue = fields[fieldName]?.value || '';
      const validation = validateField(fieldName, fieldValue, config);
      
      updatedFields[fieldName] = {
        name: fieldName,
        value: fieldValue,
        validation,
        isDirty: true,
      };

      if (!validation.isValid) {
        errors.push(`${fieldName}: ${validation.error}`);
      }
    }

    setFields(updatedFields);

    // Monitor validation results
    if (errors.length > 0) {
      monitorFormValidation(formName, errors);
    }

    return errors.length === 0;
  }, [fields, validateField, monitorFormValidation, formName]);

  const getFieldValue = useCallback((name: string): string => {
    return fields[name]?.value || '';
  }, [fields]);

  const getFieldValidation = useCallback((name: string): ValidationResult => {
    return fields[name]?.validation || { isValid: true };
  }, [fields]);

  const getFieldError = useCallback((name: string): string | undefined => {
    const field = fields[name];
    return field?.isDirty && !field.validation.isValid 
      ? field.validation.error 
      : undefined;
  }, [fields]);

  const getSanitizedValues = useCallback((): Record<string, string> => {
    const sanitized: Record<string, string> = {};
    
    for (const [name, field] of Object.entries(fields)) {
      sanitized[name] = field.validation.sanitized || field.value;
    }
    
    return sanitized;
  }, [fields]);

  const isFormValid = useCallback((): boolean => {
    return Object.values(fields).every(field => field.validation.isValid);
  }, [fields]);

  const hasFieldErrors = useCallback((): boolean => {
    return Object.values(fields).some(
      field => field.isDirty && !field.validation.isValid
    );
  }, [fields]);

  const resetForm = useCallback(() => {
    setFields({});
    setIsSubmitting(false);
  }, []);

  const submitForm = useCallback(async (
    fieldConfigs: Record<string, ValidationConfig>,
    onSubmit: (sanitizedValues: Record<string, string>) => Promise<void>
  ) => {
    setIsSubmitting(true);

    try {
      // Validate form
      const isValid = validateForm(fieldConfigs);
      
      if (!isValid) {
        detectSuspiciousActivity('form_submission_with_errors', {
          formName,
          errorCount: Object.values(fields).filter(f => !f.validation.isValid).length,
        });
        return false;
      }

      // Get sanitized values
      const sanitizedValues = getSanitizedValues();
      
      // Submit form
      await onSubmit(sanitizedValues);
      
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, getSanitizedValues, detectSuspiciousActivity, formName, fields]);

  return {
    // Field management
    setFieldValue,
    getFieldValue,
    getFieldValidation,
    getFieldError,
    
    // Form validation
    validateForm,
    isFormValid,
    hasFieldErrors,
    
    // Form submission
    submitForm,
    isSubmitting,
    
    // Utilities
    getSanitizedValues,
    resetForm,
    
    // State
    fields,
  };
};