/**
 * Accessibility Label Fixer Service
 * Automatically fixes label-input associations across the application
 */

import { logger } from '@/utils/logger';

export class AccessibilityLabelFixerService {
  private static instance: AccessibilityLabelFixerService;
  private isInitialized = false;
  private fixedLabels = 0;

  static getInstance(): AccessibilityLabelFixerService {
    if (!AccessibilityLabelFixerService.instance) {
      AccessibilityLabelFixerService.instance = new AccessibilityLabelFixerService();
    }
    return AccessibilityLabelFixerService.instance;
  }

  /**
   * Initialize and fix all label accessibility issues
   */
  initialize(): void {
    if (this.isInitialized) return;

    try {
      // Fix existing unassociated labels
      this.fixUnassociatedLabels();
      
      // Set up mutation observer for future labels
      this.setupLabelMonitoring();
      
      this.isInitialized = true;
      logger.security.info(`✅ Accessibility Label Fixer initialized - Fixed ${this.fixedLabels} labels`);
      
    } catch (error) {
      logger.security.error('❌ Failed to initialize label fixer:', error);
    }
  }

  /**
   * Fix all unassociated labels in the DOM
   */
  private fixUnassociatedLabels(): void {
    // Find all labels without htmlFor attribute
    const unassociatedLabels = document.querySelectorAll('label:not([for])');
    
    unassociatedLabels.forEach((label) => {
      this.fixLabel(label as HTMLLabelElement);
    });
  }

  /**
   * Fix a specific label element
   */
  private fixLabel(label: HTMLLabelElement): void {
    // Strategy 1: Find next input/textarea/select sibling
    let nextElement = label.nextElementSibling;
    let inputElement: Element | null = null;

    // Look for input in next few siblings
    for (let i = 0; i < 3 && nextElement; i++) {
      if (this.isFormControl(nextElement)) {
        inputElement = nextElement;
        break;
      }
      
      // Check if input is nested in the next element
      const nestedInput = nextElement.querySelector('input, textarea, select');
      if (nestedInput) {
        inputElement = nestedInput;
        break;
      }
      
      nextElement = nextElement.nextElementSibling;
    }

    // Strategy 2: Look for input within same parent container
    if (!inputElement) {
      const parentContainer = label.parentElement;
      if (parentContainer) {
        const siblingInputs = parentContainer.querySelectorAll('input, textarea, select');
        if (siblingInputs.length === 1) {
          inputElement = siblingInputs[0];
        } else if (siblingInputs.length > 1) {
          // Find the closest input after this label
          const labelRect = label.getBoundingClientRect();
          let closestInput: Element | null = null;
          let closestDistance = Infinity;

          siblingInputs.forEach((input) => {
            const inputRect = input.getBoundingClientRect();
            const distance = Math.abs(inputRect.top - labelRect.bottom);
            if (distance < closestDistance && inputRect.top >= labelRect.top) {
              closestDistance = distance;
              closestInput = input;
            }
          });

          inputElement = closestInput;
        }
      }
    }

    if (inputElement && this.isFormControl(inputElement)) {
      // Generate unique ID if input doesn't have one
      let inputId = inputElement.getAttribute('id');
      if (!inputId) {
        inputId = this.generateUniqueId(inputElement);
        inputElement.setAttribute('id', inputId);
      }

      // Associate label with input
      label.setAttribute('for', inputId);
      this.fixedLabels++;

      logger.security.debug(`Fixed label association: "${label.textContent?.trim()}" -> #${inputId}`);
    }
  }

  /**
   * Check if element is a form control
   */
  private isFormControl(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    return ['input', 'textarea', 'select'].includes(tagName);
  }

  /**
   * Generate unique ID for form element
   */
  private generateUniqueId(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    const placeholder = element.getAttribute('placeholder');
    
    // Create meaningful ID based on context
    let baseId = tagName;
    
    if (placeholder) {
      baseId += '-' + placeholder.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    } else if (className) {
      const meaningfulClass = className.split(' ').find(cls => 
        !cls.startsWith('text-') && 
        !cls.startsWith('w-') && 
        !cls.startsWith('h-') &&
        !cls.startsWith('bg-') &&
        !cls.startsWith('border-')
      );
      if (meaningfulClass) {
        baseId += '-' + meaningfulClass.replace(/[^a-z0-9]/g, '-');
      }
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
   * Set up monitoring for dynamically added labels
   */
  private setupLabelMonitoring(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if added node is an unassociated label
            if (element.tagName === 'LABEL' && !element.hasAttribute('for')) {
              this.fixLabel(element as HTMLLabelElement);
            }
            
            // Check for labels within added element
            const unassociatedLabels = element.querySelectorAll('label:not([for])');
            unassociatedLabels.forEach((label) => {
              this.fixLabel(label as HTMLLabelElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Validate current label associations
   */
  validateLabelAssociations(): {
    totalLabels: number;
    associatedLabels: number;
    unassociatedLabels: number;
    score: number;
  } {
    const allLabels = document.querySelectorAll('label');
    const associatedLabels = document.querySelectorAll('label[for]');
    const unassociatedLabels = allLabels.length - associatedLabels.length;
    
    const score = allLabels.length > 0 ? (associatedLabels.length / allLabels.length) * 100 : 100;

    return {
      totalLabels: allLabels.length,
      associatedLabels: associatedLabels.length,
      unassociatedLabels,
      score
    };
  }

  /**
   * Get comprehensive accessibility report
   */
  getAccessibilityReport(): {
    labelAssociations: ReturnType<typeof this.validateLabelAssociations>;
    fixedCount: number;
    isActive: boolean;
  } {
    return {
      labelAssociations: this.validateLabelAssociations(),
      fixedCount: this.fixedLabels,
      isActive: this.isInitialized
    };
  }

  /**
   * Manual fix trigger for specific container
   */
  fixLabelsInContainer(container: Element): number {
    const unassociatedLabels = container.querySelectorAll('label:not([for])');
    let fixedInContainer = 0;

    unassociatedLabels.forEach((label) => {
      const beforeCount = this.fixedLabels;
      this.fixLabel(label as HTMLLabelElement);
      if (this.fixedLabels > beforeCount) {
        fixedInContainer++;
      }
    });

    return fixedInContainer;
  }
}

// Export singleton instance
export const accessibilityLabelFixerService = AccessibilityLabelFixerService.getInstance();