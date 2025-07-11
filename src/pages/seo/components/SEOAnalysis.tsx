import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SEOKeyword {
  id: string;
  keyword: string;
  current_position: number | null;
  previous_position: number | null;
  target_url: string;
}

interface SEOAudit {
  id: string;
  audit_score: number | null;
  audit_type: string | null;
  issues_found: number | null;
  issues_fixed: number | null;
}

export const SEOAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [audits, setAudits] = useState<SEOAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState(0);

  useEffect(() => {
    if (user) {
      fetchSEOData();
    }
  }, [user]);

  const fetchSEOData = async () => {
    try {
      // Fetch keywords
      const { data: keywordsData } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('user_id', user!.id)
        .limit(5);

      // Fetch audits
      const { data: auditsData } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      setKeywords(keywordsData || []);
      setAudits(auditsData || []);
      
      // Calculate SEO score based on real data
      const latestAudit = auditsData?.[0];
      setSeoScore(latestAudit?.audit_score || 0);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSEOIssues = () => {
    const latestAudit = audits[0];
    const issues = [];

    if (latestAudit?.issues_found) {
      issues.push({
        type: 'error',
        title: 'SEO Issues Found',
        count: latestAudit.issues_found,
        severity: 'high' as const,
        icon: AlertCircle,
        color: 'text-red-500'
      });
    }

    if (latestAudit?.issues_fixed) {
      issues.push({
        type: 'success',
        title: 'Issues Fixed',
        count: latestAudit.issues_fixed,
        severity: 'good' as const,
        icon: CheckCircle,
        color: 'text-green-500'
      });
    }

    if (keywords.length === 0) {
      issues.push({
        type: 'warning',
        title: 'No Keywords Tracked',
        count: 0,
        severity: 'medium' as const,
        icon: Clock,
        color: 'text-yellow-500'
      });
    }

    return issues;
  };

  const getRankingData = () => {
    return keywords.map(keyword => {
      const current = keyword.current_position || 0;
      const previous = keyword.previous_position || 0;
      const change = current && previous ? current - previous : 0;
      
      return {
        keyword: keyword.keyword,
        position: current,
        change: change === 0 ? '0' : change > 0 ? `+${change}` : `${change}`,
        trend: change < 0 ? 'up' : change > 0 ? 'down' : 'stable'
      };
    });
  };

  const getSEOScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-yellow-600' };
    return { label: 'Needs Work', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading SEO data...</span>
      </div>
    );
  }

  const seoIssues = getSEOIssues();
  const rankingData = getRankingData();
  const scoreLabel = getSEOScoreLabel(seoScore);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>SEO Health Score</CardTitle>
          <CardDescription>Overall website SEO performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{seoScore}/100</span>
            <Badge variant="secondary" className={scoreLabel.color}>{scoreLabel.label}</Badge>
          </div>
          <Progress value={seoScore} className="w-full" />
          
          <div className="space-y-3">
            {seoIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <issue.icon className={`h-4 w-4 ${issue.color}`} />
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-sm text-muted-foreground">{issue.count} issues found</p>
                  </div>
                </div>
                <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'secondary' : 'default'}>
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyword Rankings</CardTitle>
          <CardDescription>Your top performing keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankingData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.keyword}</p>
                  <p className="text-sm text-muted-foreground">Position #{item.position}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                    {item.change}
                  </Badge>
                  <TrendingUp className={`h-4 w-4 ${
                    item.trend === 'up' ? 'text-green-500' : 
                    item.trend === 'down' ? 'text-red-500 rotate-180' : 
                    'text-gray-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};