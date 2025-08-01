/**
 * Comprehensive Form Accessibility Service
 * Fixes all form accessibility issues: missing IDs/names, missing autocomplete, unassociated labels
 */

import { logger } from '@/utils/logger';

interface FormAccessibilityReport {
  totalFormFields: number;
  missingIds: number;
  missingAutocomplete: number;
  unassociatedLabels: number;
  fixedIds: number;
  fixedAutocomplete: number;
  fixedLabels: number;
  score: number;
}

// Autocomplete values mapping based on MDN documentation
const AUTOCOMPLETE_MAPPING: Record<string, string> = {
  // Personal information
  'email': 'email',
  'name': 'name',
  'fullname': 'name',
  'full-name': 'name',
  'firstname': 'given-name',
  'first-name': 'given-name',
  'lastname': 'family-name',
  'last-name': 'family-name',
  'username': 'username',
  'nickname': 'nickname',
  
  // Authentication
  'password': 'current-password',
  'current-password': 'current-password',
  'new-password': 'new-password',
  'confirm-password': 'new-password',
  
  // Contact information
  'phone': 'tel',
  'telephone': 'tel',
  'mobile': 'tel',
  'address': 'street-address',
  'street': 'street-address',
  'city': 'address-level2',
  'state': 'address-level1',
  'zip': 'postal-code',
  'postal': 'postal-code',
  'country': 'country-name',
  
  // Organization
  'company': 'organization',
  'organization': 'organization',
  'title': 'organization-title',
  'job-title': 'organization-title',
  
  // Dates
  'birthday': 'bday',
  'birthdate': 'bday',
  'date': 'off',
  
  // Search and content
  'search': 'off',
  'query': 'off',
  'keywords': 'off',
  'tags': 'off',
  'content': 'off',
  'description': 'off',
  'note': 'off',
  'comment': 'off',
  
  // Financial (be careful with these)
  'card': 'cc-number',
  'cardnumber': 'cc-number',
  'cc': 'cc-number',
  'cvv': 'cc-csc',
  'cvc': 'cc-csc',
  'expiry': 'cc-exp',
  'exp': 'cc-exp'
};

export class FormAccessibilityService {
  private static instance: FormAccessibilityService;
  private isInitialized = false;
  private report: FormAccessibilityReport = {
    totalFormFields: 0,
    missingIds: 0,
    missingAutocomplete: 0,
    unassociatedLabels: 0,
    fixedIds: 0,
    fixedAutocomplete: 0,
    fixedLabels: 0,
    score: 0
  };

  static getInstance(): FormAccessibilityService {
    if (!FormAccessibilityService.instance) {
      FormAccessibilityService.instance = new FormAccessibilityService();
    }
    return FormAccessibilityService.instance;
  }

  /**
   * Initialize comprehensive form accessibility fixes
   */
  initialize(): void {
    if (this.isInitialized) return;

    try {
      // Initial fix on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.runInitialFixes());
      } else {
        this.runInitialFixes();
      }
      
      // Additional fix after a short delay to catch dynamic content
      setTimeout(() => this.runInitialFixes(), 1000);
      
      // Set up monitoring for dynamically added forms
      this.setupFormMonitoring();
      
      this.isInitialized = true;
      
    } catch (error) {
      logger.security.error('❌ Failed to initialize form accessibility service:', error);
    }
  }

  /**
   * Run initial fixes and report results
   */
  private runInitialFixes(): void {
    this.fixAllFormAccessibilityIssues();
    logger.security.info(`✅ Form Accessibility Service - Fixed ${this.report.fixedIds} IDs, ${this.report.fixedAutocomplete} autocomplete, ${this.report.fixedLabels} labels. Score: ${Math.round(this.report.score)}%`);
  }

  /**
   * Fix all form accessibility issues comprehensively
   */
  private fixAllFormAccessibilityIssues(): void {
    // Reset counters
    this.report = {
      totalFormFields: 0,
      missingIds: 0,
      missingAutocomplete: 0,
      unassociatedLabels: 0,
      fixedIds: 0,
      fixedAutocomplete: 0,
      fixedLabels: 0,
      score: 0
    };

    // Find all form fields
    const formFields = document.querySelectorAll('input, textarea, select');
    this.report.totalFormFields = formFields.length;

    formFields.forEach((field) => {
      this.fixFormField(field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
    });

    // Fix remaining unassociated labels
    this.fixUnassociatedLabels();

    // Calculate overall score
    this.calculateAccessibilityScore();
  }

  /**
   * Fix individual form field accessibility issues
   */
  private fixFormField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    const fieldType = this.getFieldType(field);
    let wasFixed = false;
    
    // Issue 1: Missing ID or name attribute - AGGRESSIVE FIXING
    if (!field.id && !field.name) {
      this.report.missingIds++;
      const generatedId = this.generateMeaningfulId(field, fieldType);
      
      // Set both ID and name for maximum compatibility
      field.id = generatedId;
      field.name = generatedId;
      
      this.report.fixedIds++;
      wasFixed = true;
      logger.security.debug(`Added ID+name to form field: ${generatedId}`);
    } else if (!field.id) {
      // Only missing ID, generate one
      const generatedId = this.generateMeaningfulId(field, fieldType);
      field.id = generatedId;
      this.report.fixedIds++;
      wasFixed = true;
      logger.security.debug(`Added ID to form field: ${generatedId}`);
    } else if (!field.name) {
      // Only missing name, use existing ID
      field.name = field.id;
      this.report.fixedIds++;
      wasFixed = true;
      logger.security.debug(`Added name to form field: ${field.id}`);
    }

    // Issue 2: Missing autocomplete attribute (for appropriate fields)
    if (this.shouldHaveAutocomplete(field, fieldType) && !field.getAttribute('autocomplete')) {
      this.report.missingAutocomplete++;
      const autocompleteValue = this.getAutocompleteValue(field, fieldType);
      if (autocompleteValue) {
        field.setAttribute('autocomplete', autocompleteValue);
        this.report.fixedAutocomplete++;
        logger.security.debug(`Added autocomplete to field: ${field.id || field.name} -> ${autocompleteValue}`);
      }
    }
  }

  /**
   * Get field type and context for better ID/autocomplete assignment
   */
  private getFieldType(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): {
    type: string;
    placeholder: string;
    label: string;
    name: string;
    className: string;
  } {
    const placeholder = field.getAttribute('placeholder') || '';
    const name = field.getAttribute('name') || '';
    const className = field.className || '';
    
    // Find associated label
    let label = '';
    const fieldId = field.id;
    if (fieldId) {
      const labelElement = document.querySelector(`label[for="${fieldId}"]`);
      if (labelElement) {
        label = labelElement.textContent?.trim() || '';
      }
    }

    // If no label found, look for nearby label
    if (!label) {
      const parentContainer = field.closest('div, fieldset, form');
      if (parentContainer) {
        const nearbyLabel = parentContainer.querySelector('label');
        if (nearbyLabel) {
          label = nearbyLabel.textContent?.trim() || '';
        }
      }
    }

    return {
      type: field.tagName === 'INPUT' ? (field as HTMLInputElement).type : field.tagName.toLowerCase(),
      placeholder: placeholder.toLowerCase(),
      label: label.toLowerCase(),
      name: name.toLowerCase(),
      className: className.toLowerCase()
    };
  }

  /**
   * Generate meaningful ID based on field context
   */
  private generateMeaningfulId(field: HTMLElement, fieldType: ReturnType<typeof this.getFieldType>): string {
    let baseId = '';

    // Priority 1: Use name attribute if meaningful
    if (fieldType.name && !fieldType.name.includes('field')) {
      baseId = fieldType.name;
    }
    // Priority 2: Use placeholder text
    else if (fieldType.placeholder) {
      baseId = fieldType.placeholder.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    // Priority 3: Use label text
    else if (fieldType.label) {
      baseId = fieldType.label.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    }
    // Priority 4: Use field type
    else {
      baseId = fieldType.type === 'text' ? 'input' : fieldType.type;
    }

    // Clean up the base ID
    baseId = baseId.replace(/^-+|-+$/g, '').substring(0, 30);
    
    if (!baseId) {
      baseId = 'form-field';
    }

    // Ensure uniqueness
    let counter = 1;
    let uniqueId = baseId;
    while (document.getElementById(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }

    return uniqueId;
  }

  /**
   * Determine if field should have autocomplete attribute
   */
  private shouldHaveAutocomplete(field: HTMLElement, fieldType: ReturnType<typeof this.getFieldType>): boolean {
    // Skip fields that explicitly should not have autocomplete
    if (fieldType.placeholder.includes('search') || 
        fieldType.label.includes('search') ||
        fieldType.placeholder.includes('query') ||
        fieldType.className.includes('search')) {
      return false;
    }

    // Skip content fields (notes, descriptions, etc.)
    if (fieldType.type === 'textarea' || 
        fieldType.placeholder.includes('content') ||
        fieldType.placeholder.includes('note') ||
        fieldType.placeholder.includes('description') ||
        fieldType.placeholder.includes('comment')) {
      return false;
    }

    // Include personal information fields
    return fieldType.type === 'email' ||
           fieldType.type === 'password' ||
           fieldType.type === 'tel' ||
           fieldType.type === 'text' ||
           fieldType.type === 'url';
  }

  /**
   * Get appropriate autocomplete value for field
   */
  private getAutocompleteValue(field: HTMLElement, fieldType: ReturnType<typeof this.getFieldType>): string {
    // Direct type mapping
    if (fieldType.type === 'email') return 'email';
    if (fieldType.type === 'tel') return 'tel';
    if (fieldType.type === 'url') return 'url';

    // Search in placeholder, label, and name for keywords
    const searchText = `${fieldType.placeholder} ${fieldType.label} ${fieldType.name}`.toLowerCase();
    
    for (const [keyword, autocompleteValue] of Object.entries(AUTOCOMPLETE_MAPPING)) {
      if (searchText.includes(keyword)) {
        return autocompleteValue;
      }
    }

    // Default for text inputs that we couldn't identify
    if (fieldType.type === 'text') {
      return 'off'; // Disable autocomplete for unidentified fields
    }

    return '';
  }

  /**
   * Fix remaining unassociated labels
   */
  private fixUnassociatedLabels(): void {
    const unassociatedLabels = document.querySelectorAll('label:not([for])');
    this.report.unassociatedLabels = unassociatedLabels.length;

    unassociatedLabels.forEach((label) => {
      if (this.fixLabelAssociation(label as HTMLLabelElement)) {
        this.report.fixedLabels++;
      }
    });
  }

  /**
   * Fix label-input association
   */
  private fixLabelAssociation(label: HTMLLabelElement): boolean {
    // Find associated input using various strategies
    let associatedInput: HTMLElement | null = null;

    // Strategy 1: Next sibling
    let nextElement = label.nextElementSibling;
    for (let i = 0; i < 3 && nextElement; i++) {
      if (this.isFormControl(nextElement)) {
        associatedInput = nextElement as HTMLElement;
        break;
      }
      
      const nestedInput = nextElement.querySelector('input, textarea, select');
      if (nestedInput) {
        associatedInput = nestedInput as HTMLElement;
        break;
      }
      
      nextElement = nextElement.nextElementSibling;
    }

    // Strategy 2: Same parent container
    if (!associatedInput) {
      const parent = label.parentElement;
      if (parent) {
        const inputs = parent.querySelectorAll('input, textarea, select');
        if (inputs.length === 1) {
          associatedInput = inputs[0] as HTMLElement;
        }
      }
    }

    if (associatedInput) {
      // Ensure input has ID
      if (!associatedInput.id) {
        const fieldType = this.getFieldType(associatedInput as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
        associatedInput.id = this.generateMeaningfulId(associatedInput, fieldType);
      }

      // Associate label with input
      label.setAttribute('for', associatedInput.id);
      logger.security.debug(`Fixed label association: "${label.textContent?.trim()}" -> #${associatedInput.id}`);
      return true;
    }

    return false;
  }

  /**
   * Check if element is a form control
   */
  private isFormControl(element: Element): boolean {
    return ['input', 'textarea', 'select'].includes(element.tagName.toLowerCase());
  }

  /**
   * Set up monitoring for dynamically added forms
   */
  private setupFormMonitoring(): void {
    const observer = new MutationObserver((mutations) => {
      let hasNewFormFields = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if added node is a form field
            if (this.isFormControl(element)) {
              this.fixFormField(element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
              hasNewFormFields = true;
            }
            
            // Check for form fields within added element
            const formFields = element.querySelectorAll('input, textarea, select');
            if (formFields.length > 0) {
              formFields.forEach((field) => {
                this.fixFormField(field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
              });
              hasNewFormFields = true;
            }

            // Check for new unassociated labels
            if (element.tagName === 'LABEL' && !element.hasAttribute('for')) {
              this.fixLabelAssociation(element as HTMLLabelElement);
            }
            
            const labels = element.querySelectorAll('label:not([for])');
            labels.forEach((label) => {
              this.fixLabelAssociation(label as HTMLLabelElement);
            });
          }
        });
      });

      if (hasNewFormFields) {
        this.calculateAccessibilityScore();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Calculate overall accessibility score
   */
  private calculateAccessibilityScore(): void {
    if (this.report.totalFormFields === 0) {
      this.report.score = 100;
      return;
    }

    const idScore = ((this.report.totalFormFields - this.report.missingIds + this.report.fixedIds) / this.report.totalFormFields) * 100;
    const autocompleteIssues = this.report.missingAutocomplete - this.report.fixedAutocomplete;
    const autocompleteScore = Math.max(0, 100 - (autocompleteIssues * 5)); // 5 points per missing autocomplete
    const labelIssues = this.report.unassociatedLabels - this.report.fixedLabels;
    const labelScore = Math.max(0, 100 - (labelIssues * 10)); // 10 points per unassociated label

    this.report.score = (idScore * 0.4) + (autocompleteScore * 0.3) + (labelScore * 0.3);
  }

  /**
   * Get current accessibility report
   */
  getAccessibilityReport(): FormAccessibilityReport {
    return { ...this.report };
  }

  /**
   * Manual validation trigger
   */
  validateAndFix(): FormAccessibilityReport {
    this.fixAllFormAccessibilityIssues();
    return this.getAccessibilityReport();
  }
}

// Export singleton instance
export const formAccessibilityService = FormAccessibilityService.getInstance();