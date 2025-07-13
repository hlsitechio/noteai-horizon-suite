import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Search, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Clock,
  Hash,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const ContentOptimization: React.FC = () => {
  const { user } = useAuth();
  const [targetKeyword, setTargetKeyword] = useState('');
  const [contentText, setContentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Array<{ id: string; title: string; description: string; priority?: string }>>([]);
  const [keywords, setKeywords] = useState<Array<{ id: string; keyword: string; current_position?: number; search_volume?: string; target_url?: string }>>([]);

  useEffect(() => {
    if (user) {
      fetchContentData();
    }
  }, [user]);

  const fetchContentData = async () => {
    try {
      // Fetch SEO recommendations related to content
      const { data: recsData } = await supabase
        .from('seo_recommendations')
        .select('*')
        .eq('user_id', user!.id)
        .eq('recommendation_type', 'content')
        .order('impact_score', { ascending: false })
        .limit(5);

      // Fetch top performing keywords
      const { data: keywordsData } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('user_id', user!.id)
        .not('current_position', 'is', null)
        .order('current_position', { ascending: true })
        .limit(5);

      setRecommendations(recsData || []);
      setKeywords(keywordsData || []);
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentAnalysis = {
    score: 75,
    wordCount: contentText.split(' ').length || 1247,
    readabilityScore: 82,
    keywordDensity: targetKeyword && contentText 
      ? ((contentText.toLowerCase().split(targetKeyword.toLowerCase()).length - 1) / contentText.split(' ').length * 100).toFixed(1)
      : 2.3,
    readingTime: Math.ceil((contentText.split(' ').length || 1247) / 200) + ' min',
    recommendations: recommendations.map(rec => ({
      type: rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success',
      title: rec.title,
      description: rec.description,
      icon: AlertCircle
    }))
  };

  const topPerformingContent = keywords.map(keyword => ({
    title: `Content for "${keyword.keyword}"`,
    url: keyword.target_url,
    views: Math.floor(Math.random() * 15000) + 1000,
    position: keyword.current_position,
    keywordTarget: keyword.keyword
  }));

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading content optimization data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Analyzer</CardTitle>
            <CardDescription>Analyze your content for SEO optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Target Keyword</label>
              <Input
                placeholder="Enter your target keyword..."
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content to Analyze</label>
              <Textarea
                placeholder="Paste your content here for SEO analysis..."
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                rows={6}
              />
            </div>
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Analyze Content
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Analysis Results</CardTitle>
            <CardDescription>SEO optimization score and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">SEO Score</span>
              <span className="text-2xl font-bold">{contentAnalysis.score}/100</span>
            </div>
            <Progress value={contentAnalysis.score} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Word Count</p>
                <p className="text-lg font-bold">{contentAnalysis.wordCount}</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Eye className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Readability</p>
                <p className="text-lg font-bold">{contentAnalysis.readabilityScore}/100</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Hash className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Keyword Density</p>
                <p className="text-lg font-bold">{contentAnalysis.keywordDensity}%</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-sm font-medium">Reading Time</p>
                <p className="text-lg font-bold">{contentAnalysis.readingTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Recommendations</CardTitle>
          <CardDescription>Actionable suggestions to improve your content SEO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contentAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                {getRecommendationIcon(rec.type)}
                <div className="flex-1">
                  <p className="font-medium">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Fix
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Your best-ranking content and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformingContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.url}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      {content.keywordTarget}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      #{content.position} ranking
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{content.views}</p>
                  <p className="text-sm text-muted-foreground">views</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};