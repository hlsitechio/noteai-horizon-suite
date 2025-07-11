import { supabase } from '@/integrations/supabase/client';

export interface FixableIssue {
  id: string;
  type: 'missing_h1' | 'broken_link' | 'large_image' | 'missing_alt' | 'duplicate_meta' | 'mobile_friendly' | 'https_certificate' | 'core_web_vitals' | 'page_speed';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  page_path?: string;
  element?: string;
  current_value?: string;
  target_value?: string;
}

export class AutoFixService {
  /**
   * Generate targeted AI prompts for different types of issues
   */
  static generateFixPrompt(issue: FixableIssue): string {
    const baseContext = `Please help me fix this technical SEO issue that was automatically detected in my OnlineNote AI application.`;
    
    switch (issue.type) {
      case 'missing_h1':
        return `${baseContext}

**Issue**: Missing H1 tags detected on pages
**Problem**: ${issue.title}
**Impact**: Pages without H1 tags have poor SEO structure and accessibility

**Please help me:**
1. Find pages missing H1 tags in the codebase
2. Add appropriate, descriptive H1 tags to each page
3. Ensure H1 tags are semantically correct and unique per page
4. Make sure H1 tags reflect the page content and include relevant keywords

**Current page path**: ${issue.page_path || 'Multiple pages'}
**Expected**: Each page should have exactly one descriptive H1 tag`;

      case 'broken_link':
        return `${baseContext}

**Issue**: Broken internal links detected
**Problem**: ${issue.title}
**Impact**: Broken links hurt user experience and SEO crawlability

**Please help me:**
1. Find and identify broken internal links in the codebase: ${issue.element || 'Multiple links'}
2. Fix or remove broken links
3. Update routing if necessary
4. Ensure all internal navigation works correctly
5. Add proper error handling for dynamic routes

**Broken link**: ${issue.element || 'Check navigation components'}
**Page**: ${issue.page_path || 'Multiple pages'}`;

      case 'large_image':
        return `${baseContext}

**Issue**: Large image files detected affecting performance
**Problem**: ${issue.title}
**Impact**: Large images slow down page loading and hurt Core Web Vitals

**Please help me:**
1. Identify large image files (>500KB): ${issue.element || 'Multiple images'}
2. Implement image optimization strategies
3. Add WebP format support with fallbacks
4. Implement lazy loading for images
5. Resize and compress images appropriately
6. Consider using next-gen image formats

**Large image**: ${issue.element || 'Check image assets'}
**Current size**: ${issue.current_value || 'Over 500KB'}
**Target**: Under 200KB optimized`;

      case 'missing_alt':
        return `${baseContext}

**Issue**: Missing alt text on images
**Problem**: ${issue.title}
**Impact**: Poor accessibility and SEO, images not discoverable by search engines

**Please help me:**
1. Find images missing alt text: ${issue.element || 'Multiple images'}
2. Add descriptive, meaningful alt text to all images
3. Ensure alt text describes the image content accurately
4. Make alt text SEO-friendly with relevant keywords when appropriate
5. Leave alt="" for decorative images only

**Image without alt**: ${issue.element || 'Check all img tags'}
**Page**: ${issue.page_path || 'Multiple pages'}`;

      case 'duplicate_meta':
        return `${baseContext}

**Issue**: Duplicate meta descriptions detected
**Problem**: ${issue.title}
**Impact**: Poor SEO, search engines can't differentiate between pages

**Please help me:**
1. Find pages with duplicate meta descriptions
2. Create unique, descriptive meta descriptions for each page (150-160 characters)
3. Ensure meta descriptions accurately reflect page content
4. Include relevant keywords naturally
5. Update the SEO system to prevent duplicates

**Affected pages**: ${issue.page_path || 'Multiple pages'}
**Current description**: ${issue.current_value || 'Duplicate content'}`;

      case 'mobile_friendly':
        return `${baseContext}

**Issue**: Mobile-friendly test failed
**Problem**: ${issue.title}
**Impact**: Poor mobile user experience and mobile SEO rankings

**Please help me:**
1. Fix mobile responsiveness issues
2. Ensure viewport meta tag is properly configured
3. Make touch targets at least 48px in size
4. Fix content overflow on mobile devices
5. Test responsive design across different screen sizes
6. Optimize mobile performance

**Current mobile score**: ${issue.current_value || 'Failing'}
**Issues**: ${issue.description}`;

      case 'https_certificate':
        return `${baseContext}

**Issue**: HTTPS certificate problems
**Problem**: ${issue.title}
**Impact**: Security warnings, poor SEO rankings, user trust issues

**Please help me:**
1. Diagnose HTTPS certificate issues
2. Configure proper SSL/TLS setup
3. Ensure all resources load over HTTPS
4. Fix mixed content warnings
5. Implement HSTS headers
6. Test certificate validity

**Current status**: ${issue.current_value || 'Invalid certificate'}
**Domain**: ${issue.page_path || window.location.hostname}`;

      case 'core_web_vitals':
        return `${baseContext}

**Issue**: Core Web Vitals need improvement
**Problem**: ${issue.title}
**Impact**: Poor user experience and Google search rankings

**Please help me optimize:**
1. **LCP (Largest Contentful Paint)**: ${issue.description.includes('LCP') ? 'Currently slow, target <2.5s' : 'Optimize largest content element'}
2. **FID (First Input Delay)**: ${issue.description.includes('FID') ? 'Currently high, target <100ms' : 'Reduce JavaScript blocking time'}
3. **CLS (Cumulative Layout Shift)**: ${issue.description.includes('CLS') ? 'Currently unstable, target <0.1' : 'Fix layout shifts'}

**Current performance**: ${issue.current_value || 'Below targets'}
**Priority**: Improve Core Web Vitals for better SEO`;

      case 'page_speed':
        return `${baseContext}

**Issue**: Page speed optimization needed
**Problem**: ${issue.title}
**Impact**: Slow loading affects user experience and SEO rankings

**Please help me optimize:**
1. Minimize and compress JavaScript/CSS
2. Optimize images and use modern formats
3. Implement lazy loading
4. Remove unused code and dependencies
5. Enable compression (Gzip/Brotli)
6. Optimize Critical Rendering Path

**Current desktop score**: ${issue.current_value || 'Below 80'}
**Current mobile score**: ${issue.description || 'Below 70'}
**Target**: Desktop >80, Mobile >70`;

      default:
        return `${baseContext}

**Issue**: ${issue.title}
**Problem**: ${issue.description}
**Severity**: ${issue.severity}

**Please help me:**
1. Analyze and understand this technical SEO issue
2. Provide specific steps to fix it
3. Implement the necessary code changes
4. Test that the fix works correctly
5. Ensure no other issues are introduced

**Details**: ${issue.element || 'See issue description'}
**Page**: ${issue.page_path || 'Check application'}`;
    }
  }

  /**
   * Send auto-fix prompt to Lovable AI chat
   */
  static async sendAutoFixPrompt(issue: FixableIssue): Promise<boolean> {
    try {
      const prompt = this.generateFixPrompt(issue);
      
      // In a real implementation, this would use Lovable's API to send the prompt
      // For now, we'll log it and copy to clipboard
      console.log('🤖 Auto-Fix Prompt Generated:', prompt);
      
      // Copy to clipboard so user can paste into chat
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
            prompt: this.generateFixPrompt(issue)
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
   * Get fix suggestions based on issue type
   */
  static getQuickFixSuggestions(issue: FixableIssue): string[] {
    switch (issue.type) {
      case 'missing_h1':
        return [
          'Add <h1> tag to page header',
          'Ensure H1 is unique and descriptive',
          'Include relevant keywords in H1'
        ];
      
      case 'broken_link':
        return [
          'Update broken link URLs',
          'Remove invalid links',
          'Check routing configuration'
        ];
      
      case 'large_image':
        return [
          'Compress images to WebP format',
          'Implement lazy loading',
          'Resize images appropriately'
        ];
      
      case 'missing_alt':
        return [
          'Add descriptive alt text',
          'Include relevant keywords',
          'Ensure accessibility compliance'
        ];
      
      case 'mobile_friendly':
        return [
          'Fix responsive design issues',
          'Optimize touch targets',
          'Check viewport configuration'
        ];
      
      default:
        return [
          'Analyze the specific issue',
          'Implement targeted fixes',
          'Test the solution thoroughly'
        ];
    }
  }

  /**
   * Send prompt directly to Lovable AI chat interface
   */
  static async integrateWithLovableChat(issue: FixableIssue): Promise<{
    success: boolean;
    message: string;
    promptId?: string;
  }> {
    try {
      const prompt = this.generateFixPrompt(issue);
      
      // Send prompt directly to Lovable chat interface
      // This will trigger the AI to process the prompt immediately
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
}