import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import CoreWebVitalsMonitor from './CoreWebVitalsMonitor';

interface SEOAnalysisData {
  overallScore: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  metrics: {
    pageSpeed: number;
    mobileUsability: number;
    accessibility: number;
    seoScore: number;
  };
  keywords: Array<{
    keyword: string;
    position: number;
    volume: number;
    difficulty: number;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    effort: 'easy' | 'medium' | 'hard';
  }>;
}

const SEOAnalysisDashboard: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<SEOAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    performSEOAnalysis();
  }, []);

  const performSEOAnalysis = async () => {
    setLoading(true);
    
    // Simulate SEO analysis - in a real app, this would call an actual SEO API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - replace with real SEO analysis
      const mockData: SEOAnalysisData = {
        overallScore: 87,
        issues: [
          {
            type: 'warning',
            message: 'Meta description is too short (less than 120 characters)',
            impact: 'medium'
          },
          {
            type: 'error',
            message: 'Missing alt text on 3 images',
            impact: 'high'
          },
          {
            type: 'info',
            message: 'Page load time could be improved',
            impact: 'low'
          }
        ],
        metrics: {
          pageSpeed: 92,
          mobileUsability: 95,
          accessibility: 88,
          seoScore: 87
        },
        keywords: [
          { keyword: 'ai note taking', position: 3, volume: 5400, difficulty: 65 },
          { keyword: 'smart notes', position: 7, volume: 2200, difficulty: 45 },
          { keyword: 'productivity app', position: 12, volume: 8900, difficulty: 78 },
          { keyword: 'note organization', position: 5, volume: 1800, difficulty: 42 }
        ],
        recommendations: [
          {
            title: 'Optimize Meta Descriptions',
            description: 'Expand meta descriptions to 150-160 characters for better SERP visibility',
            priority: 'high',
            effort: 'easy'
          },
          {
            title: 'Add Image Alt Text',
            description: 'Include descriptive alt text for all images to improve accessibility',
            priority: 'high',
            effort: 'easy'
          },
          {
            title: 'Implement Content Clusters',
            description: 'Create topic clusters around AI productivity to boost authority',
            priority: 'medium',
            effort: 'hard'
          },
          {
            title: 'Optimize Core Web Vitals',
            description: 'Reduce LCP and improve FID for better user experience signals',
            priority: 'medium',
            effort: 'medium'
          }
        ]
      };
      
      setAnalysisData(mockData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Analysis Dashboard
            </CardTitle>
            <CardDescription>Analyzing your SEO performance...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-2 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p>Failed to load SEO analysis</p>
            <Button onClick={performSEOAnalysis}>Retry Analysis</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall SEO Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                  {analysisData.overallScore}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Speed</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.pageSpeed)}`}>
                  {analysisData.metrics.pageSpeed}
                </p>
              </div>
              <Zap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mobile Usability</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.mobileUsability)}`}>
                  {analysisData.metrics.mobileUsability}
                </p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.accessibility)}`}>
                  {analysisData.metrics.accessibility}
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={performSEOAnalysis}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues</CardTitle>
                <CardDescription>
                  Issues found that may impact your search ranking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisData.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      <Badge variant={issue.impact === 'high' ? 'destructive' : issue.impact === 'medium' ? 'secondary' : 'default'} className="mt-1">
                        {issue.impact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Metrics</CardTitle>
                <CardDescription>Key performance indicators for SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysisData.metrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={getScoreColor(value)}>{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <CoreWebVitalsMonitor />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Keyword Performance
              </CardTitle>
              <CardDescription>Track your keyword rankings and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-muted-foreground">
                        Volume: {keyword.volume.toLocaleString()} • Difficulty: {keyword.difficulty}%
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={keyword.position <= 3 ? 'default' : keyword.position <= 10 ? 'secondary' : 'destructive'}>
                        Position {keyword.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
              <CardDescription>Actionable insights to improve your SEO performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{rec.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'default'}>
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {rec.effort} effort
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOAnalysisDashboard;