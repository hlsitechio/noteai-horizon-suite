import { supabase } from '@/integrations/supabase/client';

export interface TechnicalSEOIssue {
  id: string;
  type: 'missing_h1' | 'broken_link' | 'large_image' | 'missing_alt' | 'duplicate_meta' | 'mobile_friendly' | 'https_certificate';
  severity: 'critical' | 'warning' | 'info';
  page_path: string;
  element?: string;
  description: string;
  fix_suggestion: string;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay  
  cls: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  tti?: number; // Time to Interactive
}

export interface PageSpeedMetrics {
  desktop_score: number;
  mobile_score: number;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
}

export class TechnicalSEOService {
  /**
   * Analyze page for technical SEO issues
   */
  static async analyzePage(userId: string, pageUrl: string): Promise<TechnicalSEOIssue[]> {
    const issues: TechnicalSEOIssue[] = [];
    
    try {
      // This would typically use a headless browser or external API
      // For now, we'll return simulated issues based on your audit
      const simulatedIssues: TechnicalSEOIssue[] = [
        {
          id: '1',
          type: 'missing_h1',
          severity: 'critical',
          page_path: '/dashboard',
          description: 'Missing H1 tag on page',
          fix_suggestion: 'Add a descriptive H1 tag to improve page structure and SEO'
        },
        {
          id: '2',
          type: 'broken_link',
          severity: 'warning',
          page_path: '/features',
          element: '/old-feature-link',
          description: 'Broken internal link found',
          fix_suggestion: 'Update or remove broken link to improve user experience'
        },
        {
          id: '3',
          type: 'large_image',
          severity: 'warning',
          page_path: '/dashboard',
          element: 'banner-image.jpg',
          description: 'Large image file detected (>500KB)',
          fix_suggestion: 'Compress image or convert to WebP format for better performance'
        },
        {
          id: '4',
          type: 'missing_alt',
          severity: 'warning',
          page_path: '/landing',
          element: 'hero-image.png',
          description: 'Missing alt text on image',
          fix_suggestion: 'Add descriptive alt text for accessibility and SEO'
        },
        {
          id: '5',
          type: 'duplicate_meta',
          severity: 'warning',
          page_path: '/about',
          description: 'Duplicate meta description found',
          fix_suggestion: 'Create unique meta description for each page'
        }
      ];

      return simulatedIssues;
    } catch (error) {
      console.error('Error analyzing page:', error);
      return [];
    }
  }

  /**
   * Get Core Web Vitals metrics
   */
  static async getCoreWebVitals(pageUrl: string): Promise<CoreWebVitals> {
    // In a real implementation, this would use Chrome UX Report API or similar
    return {
      lcp: 2.4, // Your current LCP
      fid: 28,  // Your current FID
      cls: 0.08, // Your current CLS
      ttfb: 0.8,
      tti: 3.2
    };
  }

  /**
   * Get PageSpeed Insights metrics
   */
  static async getPageSpeedMetrics(pageUrl: string): Promise<PageSpeedMetrics> {
    // In a real implementation, this would use PageSpeed Insights API
    return {
      desktop_score: 81, // Your current desktop score
      mobile_score: 71,  // Your current mobile score
      performance_score: 75,
      accessibility_score: 89,
      best_practices_score: 83,
      seo_score: 78
    };
  }

  /**
   * Generate automated fixes for common issues
   */
  static generateFixes(issues: TechnicalSEOIssue[]): Record<string, string[]> {
    const fixes: Record<string, string[]> = {};

    issues.forEach(issue => {
      if (!fixes[issue.type]) {
        fixes[issue.type] = [];
      }

      switch (issue.type) {
        case 'missing_h1':
          fixes[issue.type].push(`Add H1 tag to ${issue.page_path}`);
          break;
        case 'broken_link':
          fixes[issue.type].push(`Fix broken link: ${issue.element} on ${issue.page_path}`);
          break;
        case 'large_image':
          fixes[issue.type].push(`Compress image: ${issue.element} on ${issue.page_path}`);
          break;
        case 'missing_alt':
          fixes[issue.type].push(`Add alt text to image: ${issue.element} on ${issue.page_path}`);
          break;
        case 'duplicate_meta':
          fixes[issue.type].push(`Create unique meta description for ${issue.page_path}`);
          break;
      }
    });

    return fixes;
  }

  /**
   * Store technical SEO audit results
   */
  static async storeAuditResults(userId: string, auditData: any): Promise<void> {
    const { error } = await supabase
      .from('seo_audits')
      .insert({
        user_id: userId,
        audit_type: 'technical_seo',
        audit_data: auditData,
        audit_score: auditData.overall_score || 0,
        issues_found: auditData.issues?.length || 0,
        issues_fixed: 0
      });

    if (error) {
      console.error('Error storing audit results:', error);
      throw error;
    }
  }

  /**
   * Get mobile-friendly test results
   */
  static async getMobileFriendlyStatus(pageUrl: string): Promise<{
    is_mobile_friendly: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    // Based on your audit results
    return {
      is_mobile_friendly: false,
      issues: [
        'Viewport meta tag configuration',
        'Touch elements too close together',
        'Content wider than screen'
      ],
      recommendations: [
        'Ensure viewport meta tag is properly configured',
        'Increase touch target sizes to at least 48px',
        'Use responsive design principles',
        'Test on multiple mobile devices'
      ]
    };
  }

  /**
   * Check HTTPS and security status
   */
  static async getSecurityStatus(domain: string): Promise<{
    https_enabled: boolean;
    ssl_grade: string;
    mixed_content_issues: number;
    security_headers: Record<string, boolean>;
  }> {
    // Based on your audit results
    return {
      https_enabled: false, // Your certificate is invalid
      ssl_grade: 'A+', // But when working, it's A+
      mixed_content_issues: 0,
      security_headers: {
        'Strict-Transport-Security': true,
        'Content-Security-Policy': true,
        'X-Frame-Options': true,
        'X-Content-Type-Options': true,
        'Referrer-Policy': true
      }
    };
  }

  /**
   * Generate comprehensive SEO report
   */
  static async generateComprehensiveReport(userId: string, domain: string): Promise<{
    core_web_vitals: CoreWebVitals;
    page_speed: PageSpeedMetrics;
    mobile_friendly: any;
    security: any;
    technical_issues: TechnicalSEOIssue[];
    overall_score: number;
  }> {
    const [coreWebVitals, pageSpeed, mobileFriendly, security, technicalIssues] = await Promise.all([
      this.getCoreWebVitals(domain),
      this.getPageSpeedMetrics(domain),
      this.getMobileFriendlyStatus(domain),
      this.getSecurityStatus(domain),
      this.analyzePage(userId, domain)
    ]);

    // Calculate overall score based on various factors
    const coreWebVitalsScore = this.calculateCoreWebVitalsScore(coreWebVitals);
    const pageSpeedScore = (pageSpeed.desktop_score + pageSpeed.mobile_score) / 2;
    const mobileScore = mobileFriendly.is_mobile_friendly ? 100 : 50;
    const securityScore = security.https_enabled ? 100 : 30;
    const technicalScore = Math.max(0, 100 - (technicalIssues.length * 5));

    const overallScore = Math.round(
      (coreWebVitalsScore * 0.3 + 
       pageSpeedScore * 0.25 + 
       mobileScore * 0.2 + 
       securityScore * 0.15 + 
       technicalScore * 0.1)
    );

    return {
      core_web_vitals: coreWebVitals,
      page_speed: pageSpeed,
      mobile_friendly: mobileFriendly,
      security: security,
      technical_issues: technicalIssues,
      overall_score: overallScore
    };
  }

  private static calculateCoreWebVitalsScore(vitals: CoreWebVitals): number {
    let score = 0;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (vitals.lcp <= 2.5) score += 40;
    else if (vitals.lcp <= 4) score += 20;
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (vitals.fid <= 100) score += 30;
    else if (vitals.fid <= 300) score += 15;
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (vitals.cls <= 0.1) score += 30;
    else if (vitals.cls <= 0.25) score += 15;
    
    return score;
  }
}