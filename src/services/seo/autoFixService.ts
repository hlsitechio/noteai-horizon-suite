// Main orchestrator service that combines all auto-fix functionality
export type { FixableIssue, AutoFixResult } from './types';
export { PromptGenerator } from './promptGenerator';
export { ChatIntegration } from './chatIntegration';
export { AuditLogger } from './auditLogger';

import { FixableIssue, AutoFixResult } from './types';
import { PromptGenerator } from './promptGenerator';
import { ChatIntegration } from './chatIntegration';
import { AuditLogger } from './auditLogger';

/**
 * Main AutoFixService that orchestrates all auto-fix functionality
 * This maintains backward compatibility with existing code
 */
export class AutoFixService {
  /**
   * Generate targeted AI prompts for different types of issues
   */
  static generateFixPrompt(issue: FixableIssue): string {
    return PromptGenerator.generateFixPrompt(issue);
  }

  /**
   * Send auto-fix prompt (legacy method)
   */
  static async sendAutoFixPrompt(issue: FixableIssue): Promise<boolean> {
    return ChatIntegration.sendAutoFixPrompt(issue);
  }

  /**
   * Log fix attempt in database
   */
  static async logFixAttempt(userId: string, issue: FixableIssue, promptSent: boolean): Promise<void> {
    return AuditLogger.logFixAttempt(userId, issue, promptSent);
  }

  /**
   * Get fix suggestions based on issue type
   */
  static getQuickFixSuggestions(issue: FixableIssue): string[] {
    return PromptGenerator.getQuickFixSuggestions(issue);
  }

  /**
   * Send prompt directly to Lovable AI chat interface
   */
  static async integrateWithLovableChat(issue: FixableIssue): Promise<AutoFixResult> {
    return ChatIntegration.integrateWithLovableChat(issue);
  }
}