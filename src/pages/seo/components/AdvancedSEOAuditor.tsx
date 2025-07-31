import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Zap, 
  Smartphone, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SEOAudit {
  id: string;
  audit_type: string;
  audit_score: number;
  issues_found: number;
  issues_fixed: number;
  audit_data: any;
  created_at: string;
}

export const AdvancedSEOAuditor: React.FC = () => {
  const { user } = useAuth();
  const [audits, setAudits] = useState<SEOAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);

  const fetchAudits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAudits(data || []);
    } catch (error) {
      console.error('Error fetching audits:', error);
      toast.error('Failed to load SEO audits');
    } finally {
      setLoading(false);
    }
  };

  const runSEOAudit = async () => {
    if (!user) return;

    setRunningAudit(true);
    try {
      // Simulate running different types of audits
      const auditTypes = ['technical', 'performance', 'mobile', 'security'];
      
      for (const auditType of auditTypes) {
        const mockAuditData = generateMockAuditData(auditType);
        
        const { error } = await supabase
          .from('seo_audits')
          .insert({
            user_id: user.id,
            audit_type: auditType,
            audit_score: mockAuditData.score,
            issues_found: mockAuditData.issues_found,
            issues_fixed: mockAuditData.issues_fixed,
            audit_data: mockAuditData.data
          });

        if (error) throw error;
      }

      toast.success('SEO audit completed successfully!');
      fetchAudits();
    } catch (error) {
      console.error('Error running audit:', error);
      toast.error('Failed to run SEO audit');
    } finally {
      setRunningAudit(false);
    }
  };

  const generateMockAuditData = (auditType: string) => {
    const auditData: any = {
      technical: {
        score: Math.floor(Math.random() * 20) + 80,
        issues_found: Math.floor(Math.random() * 10) + 5,
        issues_fixed: Math.floor(Math.random() * 8),
        data: {
          issues: [
            'Missing H1 tags on 3 pages',
            '4 broken internal links found',
            'Large image files detected',
            'Missing alt text on 7 images',
            'Duplicate meta descriptions on 2 pages'
          ],
          recommendations: [
            'Add H1 tags to all pages',
            'Fix broken internal links',
            'Compress images to improve loading speed',
            'Add descriptive alt text to images',
            'Create unique meta descriptions'
          ],
          core_web_vitals: {
            lcp: 2.4,
            fid: 28,
            cls: 0.08
          }
        }
      },
      performance: {
        score: Math.floor(Math.random() * 15) + 75,
        issues_found: Math.floor(Math.random() * 8) + 3,
        issues_fixed: Math.floor(Math.random() * 6),
        data: {
          page_speed: 3.2,
          ttfb: 0.8,
          suggestions: [
            'Enable gzip compression',
            'Optimize CSS delivery',
            'Minify JavaScript',
            'Leverage browser caching',
            'Optimize images'
          ],
          core_web_vitals: {
            lcp: 2.8,
            fid: 45,
            cls: 0.02
          }
        }
      },
      mobile: {
        score: Math.floor(Math.random() * 10) + 90,
        issues_found: Math.floor(Math.random() * 5) + 1,
        issues_fixed: Math.floor(Math.random() * 4),
        data: {
          mobile_friendly: true,
          viewport_configured: true,
          touch_targets: 'adequate',
          issues: [
            'Some buttons too small on mobile',
            'Text readability could be improved'
          ],
          suggestions: [
            'Increase button size for better touch interaction',
            'Improve text contrast ratio'
          ]
        }
      },
      security: {
        score: Math.floor(Math.random() * 5) + 95,
        issues_found: Math.floor(Math.random() * 3),
        issues_fixed: Math.floor(Math.random() * 3),
        data: {
          https_enabled: true,
          ssl_certificate: 'valid',
          security_headers: {
            hsts: true,
            xss_protection: true,
            content_type_options: true
          },
          issues: [],
          suggestions: [
            'Implement Content Security Policy',
            'Add security headers'
          ]
        }
      }
    };

    return auditData[auditType];
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAuditIcon = (auditType: string) => {
    switch (auditType) {
      case 'technical': return <Search className="h-5 w-5" />;
      case 'performance': return <Zap className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getAuditTypeColor = (auditType: string) => {
    switch (auditType) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'mobile': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading SEO audits...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestAudits = audits.slice(0, 4);
  const averageScore = audits.length > 0 
    ? Math.round(audits.reduce((sum, audit) => sum + audit.audit_score, 0) / audits.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall SEO Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}/100
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issues Found</p>
                <p className="text-2xl font-bold text-orange-600">
                  {audits.reduce((sum, audit) => sum + audit.issues_found, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issues Fixed</p>
                <p className="text-2xl font-bold text-green-600">
                  {audits.reduce((sum, audit) => sum + audit.issues_fixed, 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Audit</p>
                <p className="text-sm font-bold">
                  {audits[0] ? new Date(audits[0].created_at).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Run New Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            SEO Site Audit
          </CardTitle>
          <CardDescription>
            Run a comprehensive analysis of your website's SEO health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runSEOAudit} 
            disabled={runningAudit}
            className="w-full md:w-auto"
          >
            {runningAudit ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Audit...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Full SEO Audit
              </>
            )}
          </Button>
          {runningAudit && (
            <div className="mt-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing technical SEO, performance, mobile-friendliness, and security...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Results</CardTitle>
          <CardDescription>
            Latest SEO audit findings and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latestAudits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No audits available. Run your first SEO audit above.
            </p>
          ) : (
            <div className="space-y-4">
              {latestAudits.map((audit) => (
                <div key={audit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getAuditIcon(audit.audit_type)}
                      <div>
                        <Badge className={getAuditTypeColor(audit.audit_type)}>
                          {audit.audit_type.charAt(0).toUpperCase() + audit.audit_type.slice(1)} SEO
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(audit.audit_score)}`}>
                        {audit.audit_score}/100
                      </p>
                      <Progress value={audit.audit_score} className="w-20 mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Issues Found ({audit.issues_found})</h4>
                      {audit.audit_data?.issues?.slice(0, 3).map((issue: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          {issue}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      {audit.audit_data?.recommendations?.slice(0, 3).map((rec: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {audit.audit_data?.core_web_vitals && (
                    <div className="mt-4 p-3 bg-muted/50 rounded">
                      <h4 className="font-medium mb-2">Core Web Vitals</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">LCP:</span> {audit.audit_data.core_web_vitals.lcp}s
                        </div>
                        <div>
                          <span className="font-medium">FID:</span> {audit.audit_data.core_web_vitals.fid}ms
                        </div>
                        <div>
                          <span className="font-medium">CLS:</span> {audit.audit_data.core_web_vitals.cls}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};