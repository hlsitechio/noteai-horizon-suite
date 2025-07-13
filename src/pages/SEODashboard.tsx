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
import { KeywordTracker } from '@/pages/seo/components/KeywordTracker';
import { BacklinksTracker } from '@/pages/seo/components/BacklinksTracker';
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
        <Tabs defaultValue="keywords" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Keywords
            </TabsTrigger>
            <TabsTrigger value="backlinks" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Backlinks
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keywords">
            <KeywordTracker />
          </TabsContent>

          <TabsContent value="backlinks">
            <BacklinksTracker />
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Content Analysis & Optimization
                </CardTitle>
                <CardDescription>
                  Analyze your content against tracked keywords and get AI-powered optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 rounded-lg border-2 border-dashed border-muted-foreground/25 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Coming Soon: Advanced Content Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Analyze your content against your tracked keywords, get optimization suggestions, and improve your SEO rankings.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium">✨ Keyword Density Analysis</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Check if your content properly targets your tracked keywords
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium">📊 Content Score</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get an overall SEO score for your content
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium">🎯 Optimization Tips</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI-powered suggestions to improve your content
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium">📈 Performance Tracking</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Monitor how changes affect your keyword rankings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    SEO Tools & Resources
                  </CardTitle>
                  <CardDescription>
                    Essential tools for keyword research and SEO optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Search className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Keyword Research</h4>
                      <p className="text-sm text-muted-foreground">
                        Find new keyword opportunities for your content
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <BarChart3 className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Rank Monitoring</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your keyword positions over time
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-medium">Competition Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyze what keywords your competitors rank for
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