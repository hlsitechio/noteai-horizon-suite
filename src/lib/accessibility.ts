/**
 * Accessibility utilities and helpers
 */

/**
 * Announce content to screen readers without visual display
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Enhanced focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  
  static trap(container: HTMLElement) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  static saveFocus() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }
  
  static restoreFocus() {
    const lastFocused = this.focusStack.pop();
    if (lastFocused && lastFocused.isConnected) {
      lastFocused.focus();
    }
  }
  
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    
    return Array.from(container.querySelectorAll(selector))
      .filter(el => this.isVisible(el as HTMLElement)) as HTMLElement[];
  }
  
  private static isVisible(element: HTMLElement): boolean {
    const style = getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }
}

/**
 * ARIA utilities for dynamic content
 */
export class AriaUtils {
  static setExpandedState(trigger: HTMLElement, expanded: boolean) {
    trigger.setAttribute('aria-expanded', expanded.toString());
  }
  
  static setSelectedState(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', selected.toString());
  }
  
  static setCheckedState(element: HTMLElement, checked: boolean) {
    element.setAttribute('aria-checked', checked.toString());
  }
  
  static setPressedState(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString());
  }
  
  static setLiveRegion(element: HTMLElement, politeness: 'off' | 'polite' | 'assertive' = 'polite') {
    element.setAttribute('aria-live', politeness);
    element.setAttribute('aria-atomic', 'true');
  }
  
  static generateId(prefix = 'element'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  static connectElements(trigger: HTMLElement, target: HTMLElement, relationship: 'controls' | 'describedby' | 'labelledby') {
    if (!target.id) {
      target.id = this.generateId();
    }
    
    const existingValue = trigger.getAttribute(`aria-${relationship}`) || '';
    const values = existingValue.split(' ').filter(Boolean);
    
    if (!values.includes(target.id)) {
      values.push(target.id);
      trigger.setAttribute(`aria-${relationship}`, values.join(' '));
    }
  }
}

/**
 * Keyboard navigation helpers
 */
export class KeyboardNavigation {
  static handleArrowNavigation(
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    options: {
      loop?: boolean;
      orientation?: 'horizontal' | 'vertical' | 'both';
    } = {}
  ): number {
    const { loop = true, orientation = 'vertical' } = options;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
        
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
        }
        break;
        
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
        }
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }
    
    return newIndex;
  }
}

/**
 * Color contrast utilities
 */
export class ContrastUtils {
  static getContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  static meetsWCAGStandard(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }
  
  private static getLuminance(color: string): number {
    // Simplified luminance calculation for RGB values
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  
  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }
}