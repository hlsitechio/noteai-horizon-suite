import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Brain, 
  Volume2, 
  Gauge,
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';
import SEOAnalysisDashboard from '@/components/SEO/SEOAnalysisDashboard';
import CoreWebVitalsMonitor from '@/components/SEO/CoreWebVitalsMonitor';
import AIContentOptimizer from '@/components/AI/AIContentOptimizer';
import VoiceSearchOptimizer from '@/components/SEO/VoiceSearchOptimizer';
import AdvancedSEOOptimizer from '@/components/SEO/AdvancedSEOOptimizer';

const SEODashboard: React.FC = () => {
  // Mock SEO overview data
  const seoOverview = {
    overallScore: 87,
    organicTraffic: '+23%',
    keywordRankings: 156,
    averagePosition: 8.2,
    issues: 3
  };

  return (
    <>
      <AdvancedSEOOptimizer 
        title="SEO Dashboard - Online Note AI"
        description="Comprehensive SEO analysis and optimization tools for your AI-powered note-taking application. Monitor performance, optimize content, and improve search rankings."
        keywords={['seo dashboard', 'seo tools', 'ai content optimization', 'search rankings', 'web performance']}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Dashboard', url: '/app/dashboard' },
          { name: 'SEO Dashboard', url: '/app/seo' }
        ]}
        faqData={[
          {
            question: 'How do I improve my SEO score?',
            answer: 'Focus on Core Web Vitals, optimize your content with AI suggestions, and ensure your site is mobile-friendly and fast-loading.'
          },
          {
            question: 'What are Core Web Vitals?',
            answer: 'Core Web Vitals are a set of real-world, user-centered metrics that quantify key aspects of user experience on your website.'
          }
        ]}
      />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your website's search engine performance with AI-powered insights
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SEO Score</p>
                  <p className="text-2xl font-bold text-green-600">{seoOverview.overallScore}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organic Traffic</p>
                  <p className="text-2xl font-bold text-green-600">{seoOverview.organicTraffic}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                  <p className="text-2xl font-bold">{seoOverview.keywordRankings}</p>
                </div>
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Position</p>
                  <p className="text-2xl font-bold">{seoOverview.averagePosition}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issues</p>
                  <p className="text-2xl font-bold text-yellow-600">{seoOverview.issues}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Need Attention
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analysis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Content
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Voice Search
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <SEOAnalysisDashboard />
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <CoreWebVitalsMonitor />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-powered suggestions to improve your website performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Optimize Images</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Compress and convert images to modern formats like WebP for faster loading
                      </p>
                      <Badge variant="secondary" className="mt-2">High Impact</Badge>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Enable Compression</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use Gzip or Brotli compression to reduce file sizes
                      </p>
                      <Badge variant="secondary" className="mt-2">Medium Impact</Badge>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Minimize JavaScript</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remove unused JavaScript and optimize bundle size
                      </p>
                      <Badge variant="secondary" className="mt-2">Medium Impact</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <AIContentOptimizer />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceSearchOptimizer />
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    SEO Tools & Utilities
                  </CardTitle>
                  <CardDescription>
                    Additional tools to enhance your SEO strategy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Search className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Keyword Research</h4>
                      <p className="text-sm text-muted-foreground">
                        Discover new keyword opportunities
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <BarChart3 className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Competitor Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze competitor SEO strategies
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Rank Tracking</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor keyword rankings over time
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Brain className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Content Suggestions</h4>
                      <p className="text-sm text-muted-foreground">
                        AI-powered content recommendations
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Volume2 className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Voice Search Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Track voice search performance
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Gauge className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Site Audit</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive SEO health check
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SEODashboard;