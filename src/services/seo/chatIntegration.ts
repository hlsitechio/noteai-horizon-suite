import { FixableIssue, AutoFixResult } from './types';
import { PromptGenerator } from './promptGenerator';

export class ChatIntegration {
  /**
   * Send prompt directly to Lovable AI chat interface
   */
  static async integrateWithLovableChat(issue: FixableIssue): Promise<AutoFixResult> {
    try {
      const prompt = PromptGenerator.generateFixPrompt(issue);
      
      // Send prompt directly to Lovable chat interface
      this.sendToLovableChat(prompt);

      return {
        success: true,
        message: 'Auto-fix prompt sent to Lovable AI! The assistant will help you fix this issue.',
        promptId: `fix_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send auto-fix prompt. Please try again.'
      };
    }
  }

  /**
   * Send message directly to Lovable chat interface
   */
  private static sendToLovableChat(message: string): void {
    // Use Lovable's internal messaging system to send the prompt directly to chat
    if (typeof window !== 'undefined' && (window as any).parent) {
      try {
        // Send message to parent frame (Lovable interface)
        (window as any).parent.postMessage({
          type: 'LOVABLE_CHAT_MESSAGE',
          payload: {
            message: message,
            source: 'auto-fix-system',
            timestamp: Date.now()
          }
        }, '*');
      } catch (error) {
        console.error('Failed to send message to Lovable chat:', error);
        // Fallback to console for development
        console.log('🤖 Auto-Fix Prompt for Lovable:', message);
      }
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