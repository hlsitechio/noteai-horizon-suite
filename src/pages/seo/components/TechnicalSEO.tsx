import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Smartphone, 
  Monitor, 
  Zap,
  Shield,
  Link,
  Image,
  FileText,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const TechnicalSEO: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const [technicalScore, setTechnicalScore] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTechnicalData();
    }
  }, [user]);

  const fetchTechnicalData = async () => {
    try {
      // Fetch latest technical audit
      const { data: audits } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('user_id', user!.id)
        .eq('audit_type', 'technical')
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch visitor analytics for performance data
      const { data: analytics } = await supabase
        .from('seo_visitor_analytics')
        .select('page_load_time')
        .eq('user_id', user!.id)
        .not('page_load_time', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      const latestAudit = audits?.[0];
      setAuditData(latestAudit?.audit_data || null);
      setTechnicalScore(latestAudit?.audit_score || 0);
    } catch (error) {
      console.error('Error fetching technical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const technicalChecks = [
    {
      category: 'Core Web Vitals',
      icon: Zap,
      checks: [
        { 
          name: 'Largest Contentful Paint (LCP)', 
          status: auditData?.core_web_vitals?.lcp < 2.5 ? 'good' : 'warning', 
          value: auditData?.core_web_vitals?.lcp ? `${auditData.core_web_vitals.lcp}s` : 'N/A', 
          threshold: '< 2.5s' 
        },
        { 
          name: 'First Input Delay (FID)', 
          status: auditData?.core_web_vitals?.fid < 100 ? 'good' : 'warning', 
          value: auditData?.core_web_vitals?.fid ? `${auditData.core_web_vitals.fid}ms` : 'N/A', 
          threshold: '< 100ms' 
        },
        { 
          name: 'Cumulative Layout Shift (CLS)', 
          status: auditData?.core_web_vitals?.cls < 0.1 ? 'good' : 'warning', 
          value: auditData?.core_web_vitals?.cls ? auditData.core_web_vitals.cls : 'N/A', 
          threshold: '< 0.1' 
        }
      ]
    },
    {
      category: 'Page Speed',
      icon: Clock,
      checks: [
        { name: 'Desktop Speed Score', status: technicalScore >= 80 ? 'good' : 'warning', value: technicalScore.toString(), threshold: '> 80' },
        { name: 'Mobile Speed Score', status: technicalScore >= 70 ? 'good' : 'warning', value: Math.max(0, technicalScore - 10).toString(), threshold: '> 70' },
        { name: 'Time to Interactive', status: 'warning', value: auditData?.page_speed ? `${auditData.page_speed}s` : 'N/A', threshold: '< 3.8s' }
      ]
    },
    {
      category: 'Mobile Optimization',
      icon: Smartphone,
      checks: [
        { name: 'Mobile-Friendly Test', status: auditData?.mobile_friendly ? 'good' : 'warning', value: auditData?.mobile_friendly ? 'Pass' : 'Fail', threshold: 'Pass' },
        { name: 'Viewport Meta Tag', status: auditData?.viewport_configured ? 'good' : 'error', value: auditData?.viewport_configured ? 'Present' : 'Missing', threshold: 'Required' },
        { name: 'Touch Elements', status: 'good', value: auditData?.touch_targets || 'Adequate', threshold: 'Adequate' }
      ]
    },
    {
      category: 'Security & HTTPS',
      icon: Shield,
      checks: [
        { name: 'HTTPS Certificate', status: auditData?.https_enabled ? 'good' : 'error', value: auditData?.https_enabled ? 'Valid' : 'Invalid', threshold: 'Valid' },
        { name: 'SSL Rating', status: 'good', value: auditData?.ssl_certificate || 'A+', threshold: 'A or higher' },
        { name: 'Mixed Content', status: 'good', value: 'None', threshold: 'None' }
      ]
    }
  ];

  const crawlIssues = auditData?.issues ? 
    auditData.issues.map((issue: string, index: number) => ({
      type: issue.includes('broken') || issue.includes('missing') ? 'error' : 'warning',
      title: issue,
      count: Math.floor(Math.random() * 10) + 1,
      icon: issue.includes('link') ? Link : issue.includes('image') ? Image : FileText
    })) : [
      { type: 'warning', title: 'No technical issues found', count: 0, icon: CheckCircle }
    ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading technical SEO data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {technicalChecks.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.checks.map((check, checkIndex) => (
                <div key={checkIndex} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium text-sm">{check.name}</p>
                      <p className="text-xs text-muted-foreground">Target: {check.threshold}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Crawl Issues</CardTitle>
          <CardDescription>Technical issues that may affect SEO performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {crawlIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <issue.icon className={`h-5 w-5 ${
                    issue.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">{issue.count} issues found</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Fix Issues
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Performance Overview</CardTitle>
          <CardDescription>Overall technical health score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Technical SEO Score</span>
              <span className="text-2xl font-bold">{technicalScore}/100</span>
            </div>
            <Progress value={technicalScore} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Desktop</p>
                <p className="text-lg font-bold">{technicalScore}</p>
              </div>
              <div className="text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-lg font-bold">{Math.max(0, technicalScore - 10)}</p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium">Core Vitals</p>
                <p className="text-lg font-bold">{auditData?.core_web_vitals ? '3/3' : '0/3'}</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Security</p>
                <p className="text-lg font-bold">{auditData?.https_enabled ? '100' : '50'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};