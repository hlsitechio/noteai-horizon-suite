import { FixableIssue, AutoFixResult } from './types';
import { PromptGenerator } from './promptGenerator';

export class ChatIntegration {
  /**
   * AI Agent that analyzes code and sends prompt directly to Lovable chat interface
   */
  static async integrateWithLovableChat(issue: FixableIssue): Promise<AutoFixResult> {
    try {
      // AI Agent: Analyze the issue and generate technical SEO prompt
      const prompt = this.generateTechnicalSEOPrompt(issue);
      
      // Target the specific Lovable chat textarea
      const success = this.insertIntoLovableChat(prompt);
      
      if (success) {
        return {
          success: true,
          message: 'Technical SEO prompt sent to Lovable chat! 🤖',
          promptId: `fix_${Date.now()}`
        };
      } else {
        // Fallback: copy to clipboard if direct insertion fails
        this.copyToClipboard(prompt);
        return {
          success: true,
          message: 'Prompt copied to clipboard - paste it in Lovable chat.',
          promptId: `fix_${Date.now()}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate auto-fix prompt. Please try again.'
      };
    }
  }

  /**
   * AI Agent: Generate enhanced technical SEO prompt
   */
  private static generateTechnicalSEOPrompt(issue: FixableIssue): string {
    const basePrompt = PromptGenerator.generateFixPrompt(issue);
    
    // Enhanced AI-generated prompt with technical SEO context
    return `🤖 AI Technical SEO Agent Analysis:

${basePrompt}

Please analyze the current SEO implementation and:
1. Fix the identified ${issue.type} issue
2. Ensure proper semantic HTML structure
3. Optimize for Core Web Vitals if applicable
4. Maintain SEO best practices
5. Test the fix thoroughly

Priority: ${issue.severity || 'Medium'}
Expected Impact: Improved search engine visibility and user experience`;
  }

  /**
   * Insert prompt directly into Lovable chat textarea
   */
  private static insertIntoLovableChat(prompt: string): boolean {
    try {
      // Target the specific textarea using the provided selector
      const chatInput = document.querySelector('#chatinput') as HTMLTextAreaElement;
      
      if (chatInput) {
        // Set the value
        chatInput.value = prompt;
        
        // Trigger input events to ensure React state updates
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        
        chatInput.dispatchEvent(inputEvent);
        chatInput.dispatchEvent(changeEvent);
        
        // Focus the textarea
        chatInput.focus();
        
        // Move cursor to end
        chatInput.setSelectionRange(prompt.length, prompt.length);
        
        console.log('✅ Prompt successfully inserted into Lovable chat');
        return true;
      } else {
        console.warn('❌ Lovable chat textarea not found');
        return false;
      }
    } catch (error) {
      console.error('❌ Error inserting prompt into chat:', error);
      return false;
    }
  }

  /**
   * Fallback: Copy prompt to clipboard
   */
  private static async copyToClipboard(prompt: string): Promise<void> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prompt);
        console.log('✅ Prompt copied to clipboard');
      }
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error);
    }
  }

  /**
   * Show prompt in a copyable modal
   */
   private static showPromptModal(prompt: string): void {
    // Create a simple prompt display that works in any environment
    const promptText = `${prompt}\n\n👆 Copy this text and paste it in the Lovable chat to get AI assistance!`;
    
    // Try to copy to clipboard automatically
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prompt).then(() => {
        alert('✅ Auto-fix prompt copied to clipboard!\n\nPaste it in the Lovable chat to get instant help.');
      }).catch(() => {
        // Fallback: show prompt for manual copy
        prompt = window.prompt('Copy this auto-fix prompt and paste it in Lovable chat:', prompt) || '';
      });
    } else {
      // Fallback for browsers without clipboard API
      window.prompt('Copy this auto-fix prompt and paste it in Lovable chat:', prompt);
    }
  }

  /**
   * Legacy method - send auto-fix prompt (deprecated, use integrateWithLovableChat instead)
   */
  static async sendAutoFixPrompt(issue: FixableIssue): Promise<boolean> {
    try {
      const prompt = PromptGenerator.generateFixPrompt(issue);
      
      console.log('🤖 Auto-Fix Prompt Generated:', prompt);
      
      // Copy to clipboard as fallback
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(prompt);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sending auto-fix prompt:', error);
      return false;
    }
  }
}