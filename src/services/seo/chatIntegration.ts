import { FixableIssue, AutoFixResult } from './types';
import { PromptGenerator } from './promptGenerator';

export class ChatIntegration {
  /**
   * Send prompt directly to Lovable AI chat interface
   */
  static async integrateWithLovableChat(issue: FixableIssue): Promise<AutoFixResult> {
    try {
      const prompt = PromptGenerator.generateFixPrompt(issue);
      
      // Show the prompt in a modal/alert that user can copy
      this.showPromptModal(prompt);

      return {
        success: true,
        message: 'Auto-fix prompt ready! Copy the text and paste it in the Lovable chat.',
        promptId: `fix_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate auto-fix prompt. Please try again.'
      };
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