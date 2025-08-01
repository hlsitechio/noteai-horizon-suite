/**
 * Form Accessibility Diagnostic Tool
 * Identifies and reports all form accessibility issues in real-time
 */

import { logger } from '@/utils/logger';

export class FormAccessibilityDiagnostic {
  
  /**
   * Run comprehensive diagnostic on current DOM
   */
  static runDiagnostic(): {
    totalFormFields: number;
    fieldsWithoutId: Array<{
      element: string;
      type: string;
      className: string;
      placeholder: string;
      location: string;
    }>;
    fieldsWithoutName: Array<{
      element: string;
      type: string;
      className: string;
      placeholder: string;
      location: string;
    }>;
    fieldsWithoutBoth: Array<{
      element: string;
      type: string;
      className: string;
      placeholder: string;
      location: string;
    }>;
    report: string;
  } {
    const allFormFields = document.querySelectorAll('input, textarea, select');
    
    const fieldsWithoutId: any[] = [];
    const fieldsWithoutName: any[] = [];
    const fieldsWithoutBoth: any[] = [];

    allFormFields.forEach((field, index) => {
      const hasId = field.hasAttribute('id') && field.getAttribute('id')?.trim();
      const hasName = field.hasAttribute('name') && field.getAttribute('name')?.trim();
      
      const fieldInfo = {
        element: field.tagName.toLowerCase(),
        type: field.getAttribute('type') || field.tagName.toLowerCase(),
        className: field.className || 'no-class',
        placeholder: field.getAttribute('placeholder') || 'no-placeholder',
        location: this.getElementLocation(field)
      };

      if (!hasId) {
        fieldsWithoutId.push(fieldInfo);
      }
      
      if (!hasName) {
        fieldsWithoutName.push(fieldInfo);
      }
      
      if (!hasId && !hasName) {
        fieldsWithoutBoth.push(fieldInfo);
      }
    });

    const report = this.generateReport(allFormFields.length, fieldsWithoutId, fieldsWithoutName, fieldsWithoutBoth);
    
    console.group('🔍 Form Accessibility Diagnostic');
    console.log(report);
    console.log('Fields without ID:', fieldsWithoutId);
    console.log('Fields without name:', fieldsWithoutName);
    console.log('Fields without both:', fieldsWithoutBoth);
    console.groupEnd();

    return {
      totalFormFields: allFormFields.length,
      fieldsWithoutId,
      fieldsWithoutName,
      fieldsWithoutBoth,
      report
    };
  }

  /**
   * Get element location description
   */
  private static getElementLocation(element: Element): string {
    const rect = element.getBoundingClientRect();
    const parent = element.closest('[class*="modal"], [class*="dialog"], [class*="panel"], [class*="form"], [class*="card"]');
    const parentDesc = parent ? parent.className.split(' ')[0] : 'page';
    
    return `${parentDesc} (${Math.round(rect.top)}, ${Math.round(rect.left)})`;
  }

  /**
   * Generate diagnostic report
   */
  private static generateReport(total: number, withoutId: any[], withoutName: any[], withoutBoth: any[]): string {
    const issues = [];
    
    if (withoutBoth.length > 0) {
      issues.push(`❌ ${withoutBoth.length} fields missing BOTH id AND name`);
    }
    
    if (withoutId.length > withoutBoth.length) {
      issues.push(`⚠️  ${withoutId.length - withoutBoth.length} fields missing only ID`);
    }
    
    if (withoutName.length > withoutBoth.length) {
      issues.push(`⚠️  ${withoutName.length - withoutBoth.length} fields missing only name`);
    }

    if (issues.length === 0) {
      return `✅ All ${total} form fields have proper IDs and/or names`;
    }

    return `📊 Found ${total} form fields:\n${issues.join('\n')}`;
  }

  /**
   * Fix all identified issues immediately
   */
  static fixAllIssuesNow(): {
    fixed: number;
    errors: string[];
  } {
    const diagnostic = this.runDiagnostic();
    const errors: string[] = [];
    let fixed = 0;

    // Fix fields without both id and name (highest priority)
    diagnostic.fieldsWithoutBoth.forEach((fieldInfo, index) => {
      try {
        // Find the actual element in DOM
        const elements = document.querySelectorAll(`${fieldInfo.element}[class*="${fieldInfo.className.split(' ')[0]}"]`);
        
        // Try to find the exact element by placeholder
        let targetElement: Element | null = null;
        elements.forEach(el => {
          if (el.getAttribute('placeholder') === fieldInfo.placeholder || 
              (!fieldInfo.placeholder && !el.getAttribute('placeholder'))) {
            targetElement = el;
          }
        });

        if (!targetElement && elements.length > 0) {
          targetElement = elements[0]; // Fallback to first match
        }

        if (targetElement) {
          const generatedId = this.generateEmergencyId(targetElement, index);
          targetElement.setAttribute('id', generatedId);
          targetElement.setAttribute('name', generatedId);
          fixed++;
          console.log(`🔧 Emergency fix applied: ${generatedId}`);
        }
      } catch (error) {
        errors.push(`Failed to fix ${fieldInfo.element}: ${error}`);
      }
    });

    return { fixed, errors };
  }

  /**
   * Generate emergency ID for problematic fields
   */
  private static generateEmergencyId(element: Element, index: number): string {
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute('type') || tagName;
    const placeholder = element.getAttribute('placeholder');
    const className = element.className;

    let baseId = '';

    // Try to create meaningful ID from context
    if (placeholder) {
      baseId = placeholder.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 20);
    } else if (className) {
      const meaningfulClass = className.split(' ').find(cls => 
        !cls.startsWith('w-') && 
        !cls.startsWith('h-') && 
        !cls.startsWith('text-') && 
        !cls.startsWith('bg-') &&
        cls.length > 2
      );
      if (meaningfulClass) {
        baseId = meaningfulClass.replace(/[^a-z0-9]/g, '-').substring(0, 20);
      }
    }

    if (!baseId) {
      baseId = `${type}-field`;
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
   * Monitor for new form fields
   */
  static startContinuousMonitoring(): void {
    // Run initial diagnostic
    this.runDiagnostic();

    // Set up monitoring for new fields
    const observer = new MutationObserver((mutations) => {
      let hasNewFormFields = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if it's a form field
            if (['input', 'textarea', 'select'].includes(element.tagName.toLowerCase())) {
              if (!element.hasAttribute('id') && !element.hasAttribute('name')) {
                console.warn('🚨 New form field detected without ID/name:', element);
                hasNewFormFields = true;
              }
            }
            
            // Check for nested form fields
            const nestedFields = element.querySelectorAll('input, textarea, select');
            nestedFields.forEach(field => {
              if (!field.hasAttribute('id') && !field.hasAttribute('name')) {
                console.warn('🚨 New nested form field detected without ID/name:', field);
                hasNewFormFields = true;
              }
            });
          }
        });
      });

      if (hasNewFormFields) {
        setTimeout(() => {
          console.log('🔄 Re-running diagnostic due to new form fields...');
          this.runDiagnostic();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('🔍 Form accessibility monitoring started');
  }
}

// Export for window access
if (typeof window !== 'undefined') {
  (window as any).FormDiagnostic = FormAccessibilityDiagnostic;
}