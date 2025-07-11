import { supabase } from '@/integrations/supabase/client';
import { FixableIssue } from './types';
import { PromptGenerator } from './promptGenerator';

export class AuditLogger {
  /**
   * Log fix attempt in database
   */
  static async logFixAttempt(userId: string, issue: FixableIssue, promptSent: boolean): Promise<void> {
    try {
      await supabase
        .from('seo_audits')
        .insert({
          user_id: userId,
          audit_type: 'auto_fix_attempt',
          audit_data: {
            issue_id: issue.id,
            issue_type: issue.type,
            issue_title: issue.title,
            issue_description: issue.description,
            issue_severity: issue.severity,
            prompt_sent: promptSent,
            timestamp: new Date().toISOString(),
            prompt: PromptGenerator.generateFixPrompt(issue)
          } as any,
          audit_score: 0,
          issues_found: 1,
          issues_fixed: 0
        });
    } catch (error) {
      console.error('Error logging fix attempt:', error);
    }
  }

  /**
   * Log successful fix completion
   */
  static async logFixCompletion(userId: string, issueId: string, fixDetails?: any): Promise<void> {
    try {
      await supabase
        .from('seo_audits')
        .insert({
          user_id: userId,
          audit_type: 'auto_fix_completion',
          audit_data: {
            issue_id: issueId,
            fix_completed: true,
            fix_details: fixDetails,
            timestamp: new Date().toISOString()
          } as any,
          audit_score: 100,
          issues_found: 0,
          issues_fixed: 1
        });
    } catch (error) {
      console.error('Error logging fix completion:', error);
    }
  }
}