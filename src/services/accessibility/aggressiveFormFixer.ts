/**
 * Aggressive Form Field Fixer
 * Handles all edge cases including shadcn/ui components and React form fields
 */

import { logger } from '@/utils/logger';

export class AggressiveFormFieldFixer {
  private static fixedCount = 0;
  private static isRunning = false;

  /**
   * Run aggressive fixing on all form fields, including React components
   */
  static runAggressiveFix(): number {
    if (this.isRunning) return this.fixedCount;
    this.isRunning = true;
    this.fixedCount = 0;

    try {
      // Method 1: Direct DOM query for all form elements
      this.fixDirectFormElements();
      
      // Method 2: Fix shadcn/ui components
      this.fixShadcnComponents();
      
      // Method 3: Fix elements with form-like classes
      this.fixFormLikeElements();
      
      // Method 4: Fix elements by common patterns
      this.fixByCommonPatterns();

      logger.security.info(`🔧 Aggressive form fixer completed: ${this.fixedCount} fields fixed`);
      
    } catch (error) {
      logger.security.error('❌ Aggressive form fixer failed:', error);
    } finally {
      this.isRunning = false;
    }

    return this.fixedCount;
  }

  /**
   * Fix direct form elements (input, textarea, select)
   */
  private static fixDirectFormElements(): void {
    const elements = document.querySelectorAll('input, textarea, select');
    
    elements.forEach((element, index) => {
      const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      
      if (!input.id && !input.name) {
        const id = this.generateId(input, 'direct', index);
        input.id = id;
        input.name = id;
        this.fixedCount++;
        
        // Also add autocomplete if appropriate
        this.addAutocompleteIfNeeded(input);
      }
    });
  }

  /**
   * Fix shadcn/ui and other React component inputs
   */
  private static fixShadcnComponents(): void {
    // Common shadcn/ui component selectors
    const componentSelectors = [
      '[class*="input"], [class*="Input"]',
      '[class*="textarea"], [class*="Textarea"]', 
      '[class*="select"], [class*="Select"]',
      '[data-testid*="input"]',
      '[data-testid*="textarea"]',
      '[data-testid*="select"]'
    ];

    componentSelectors.forEach(selector => {
      const components = document.querySelectorAll(selector);
      
      components.forEach((component, index) => {
        // Look for input within component
        const input = component.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        if (input && !input.id && !input.name) {
          const id = this.generateId(input, 'component', index);
          input.id = id;
          input.name = id;
          this.fixedCount++;
          this.addAutocompleteIfNeeded(input);
        }
      });
    });
  }

  /**
   * Fix elements that look like form inputs based on classes
   */
  private static fixFormLikeElements(): void {
    // Look for elements with form-related classes but missing proper form elements
    const formSelectors = [
      '[class*="form-control"]',
      '[class*="form-input"]',
      '[class*="field"]',
      '[class*="input-"]',
      '[class*="text-input"]',
      '[placeholder]'
    ];

    formSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach((element, index) => {
        if (['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
          const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          
          if (!input.id && !input.name) {
            const id = this.generateId(input, 'form-like', index);
            input.id = id;
            input.name = id;
            this.fixedCount++;
            this.addAutocompleteIfNeeded(input);
          }
        }
      });
    });
  }

  /**
   * Fix by common patterns and locations
   */
  private static fixByCommonPatterns(): void {
    // Pattern 1: Inputs in modal/dialog contexts
    const modals = document.querySelectorAll('[class*="modal"], [class*="dialog"], [role="dialog"]');
    modals.forEach((modal, modalIndex) => {
      const inputs = modal.querySelectorAll('input, textarea, select');
      inputs.forEach((input, inputIndex) => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!element.id && !element.name) {
          const id = this.generateId(element, `modal-${modalIndex}`, inputIndex);
          element.id = id;
          element.name = id;
          this.fixedCount++;
          this.addAutocompleteIfNeeded(element);
        }
      });
    });

    // Pattern 2: Inputs in form containers
    const forms = document.querySelectorAll('form, [class*="form"]');
    forms.forEach((form, formIndex) => {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input, inputIndex) => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!element.id && !element.name) {
          const id = this.generateId(element, `form-${formIndex}`, inputIndex);
          element.id = id;
          element.name = id;
          this.fixedCount++;
          this.addAutocompleteIfNeeded(element);
        }
      });
    });

    // Pattern 3: Standalone inputs
    const standaloneInputs = document.querySelectorAll('input:not(form input), textarea:not(form textarea), select:not(form select)');
    standaloneInputs.forEach((input, index) => {
      const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!element.id && !element.name) {
        const id = this.generateId(element, 'standalone', index);
        element.id = id;
        element.name = id;
        this.fixedCount++;
        this.addAutocompleteIfNeeded(element);
      }
    });
  }

  /**
   * Generate meaningful ID based on context
   */
  private static generateId(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, context: string, index: number): string {
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute('type') || tagName;
    const placeholder = element.getAttribute('placeholder') || '';
    const className = element.className || '';
    
    let baseId = '';

    // Try to extract meaningful name from placeholder
    if (placeholder) {
      baseId = placeholder.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 20);
    }
    
    // Fallback to class name analysis
    if (!baseId) {
      const meaningfulClass = className.split(' ').find(cls => 
        cls.length > 3 && 
        !cls.startsWith('w-') && 
        !cls.startsWith('h-') && 
        !cls.startsWith('text-') && 
        !cls.startsWith('bg-') && 
        !cls.startsWith('border-') &&
        !cls.startsWith('rounded-') &&
        !cls.startsWith('px-') &&
        !cls.startsWith('py-') &&
        !cls.startsWith('mx-') &&
        !cls.startsWith('my-') &&
        !cls.startsWith('flex') &&
        !cls.startsWith('grid')
      );
      
      if (meaningfulClass) {
        baseId = meaningfulClass.replace(/[^a-z0-9]/g, '-').substring(0, 20);
      }
    }

    // Ultimate fallback
    if (!baseId) {
      baseId = `${type}-${context}`;
    }

    // Ensure uniqueness
    let uniqueId = `${baseId}-${index}`;
    let counter = 1;
    while (document.getElementById(uniqueId)) {
      uniqueId = `${baseId}-${index}-${counter}`;
      counter++;
    }

    return uniqueId;
  }

  /**
   * Add autocomplete attribute if appropriate
   */
  private static addAutocompleteIfNeeded(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    if (element.hasAttribute('autocomplete')) return;

    const type = element.getAttribute('type') || element.tagName.toLowerCase();
    const placeholder = (element.getAttribute('placeholder') || '').toLowerCase();
    const id = (element.id || '').toLowerCase();

    let autocomplete = '';

    // Email fields
    if (type === 'email' || placeholder.includes('email') || id.includes('email')) {
      autocomplete = 'email';
    }
    // Password fields
    else if (type === 'password' || placeholder.includes('password') || id.includes('password')) {
      autocomplete = 'current-password';
    }
    // Name fields
    else if (placeholder.includes('name') || id.includes('name')) {
      if (placeholder.includes('first') || id.includes('first')) {
        autocomplete = 'given-name';
      } else if (placeholder.includes('last') || id.includes('last')) {
        autocomplete = 'family-name';
      } else {
        autocomplete = 'name';
      }
    }
    // Phone fields
    else if (type === 'tel' || placeholder.includes('phone') || id.includes('phone')) {
      autocomplete = 'tel';
    }
    // Search fields and content fields
    else if (placeholder.includes('search') || id.includes('search') || 
             placeholder.includes('note') || id.includes('note') ||
             placeholder.includes('content') || id.includes('content') ||
             element.tagName.toLowerCase() === 'textarea') {
      autocomplete = 'off';
    }
    // Text fields that we can't identify
    else if (type === 'text') {
      autocomplete = 'off';
    }

    if (autocomplete) {
      element.setAttribute('autocomplete', autocomplete);
    }
  }

  /**
   * Get current statistics
   */
  static getStats(): { totalFixed: number; isRunning: boolean } {
    return {
      totalFixed: this.fixedCount,
      isRunning: this.isRunning
    };
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).AggressiveFormFixer = AggressiveFormFieldFixer;
}