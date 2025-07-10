import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Eye, 
  Search,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentOptimization {
  originalContent: string;
  optimizedContent: string;
  seoScore: number;
  readabilityScore: number;
  suggestions: Array<{
    type: 'seo' | 'readability' | 'engagement';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  keywords: Array<{
    keyword: string;
    density: number;
    recommended: boolean;
  }>;
  metadata: {
    title: string;
    description: string;
    tags: string[];
  };
}

const AIContentOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [optimization, setOptimization] = useState<ContentOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetKeywords, setTargetKeywords] = useState('');

  const optimizeContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to optimize');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI content optimization
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock optimization result - in a real app, this would call an AI service
      const mockOptimization: ContentOptimization = {
        originalContent: content,
        optimizedContent: content + '\n\n[AI-optimized version would include improved structure, keyword integration, and enhanced readability while maintaining the original meaning and tone.]',
        seoScore: Math.floor(Math.random() * 30) + 70,
        readabilityScore: Math.floor(Math.random() * 25) + 75,
        suggestions: [
          {
            type: 'seo',
            message: 'Add more relevant keywords naturally throughout the content',
            impact: 'high'
          },
          {
            type: 'readability',
            message: 'Break up long paragraphs for better readability',
            impact: 'medium'
          },
          {
            type: 'engagement',
            message: 'Add a compelling call-to-action at the end',
            impact: 'high'
          },
          {
            type: 'seo',
            message: 'Include more semantic keywords related to your topic',
            impact: 'medium'
          }
        ],
        keywords: [
          { keyword: 'ai note taking', density: 2.1, recommended: true },
          { keyword: 'productivity', density: 1.8, recommended: true },
          { keyword: 'smart notes', density: 0.9, recommended: false },
          { keyword: 'organization', density: 1.2, recommended: true }
        ],
        metadata: {
          title: 'AI-Generated SEO Title Based on Content',
          description: 'AI-generated meta description optimized for search engines and user engagement.',
          tags: ['ai', 'productivity', 'notes', 'optimization']
        }
      };
      
      setOptimization(mockOptimization);
      toast.success('Content optimization completed!');
    } catch (error) {
      console.error('Content optimization failed:', error);
      toast.error('Failed to optimize content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuggestionIcon = (type: 'seo' | 'readability' | 'engagement') => {
    switch (type) {
      case 'seo': return <Search className="h-4 w-4 text-blue-500" />;
      case 'readability': return <Eye className="h-4 w-4 text-green-500" />;
      case 'engagement': return <TrendingUp className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Content Optimizer
          </CardTitle>
          <CardDescription>
            Optimize your content for SEO, readability, and engagement using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Keywords (optional)</label>
            <Textarea
              placeholder="Enter target keywords separated by commas (e.g., ai notes, productivity, smart organization)"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Content to Optimize</label>
            <Textarea
              placeholder="Paste your content here to get AI-powered optimization suggestions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>
          
          <Button 
            onClick={optimizeContent} 
            disabled={loading || !content.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Optimizing Content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {optimization && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="optimized">Optimized Content</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">SEO Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(optimization.seoScore)}`}>
                        {optimization.seoScore}
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
                      <p className="text-sm font-medium text-muted-foreground">Readability Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(optimization.readabilityScore)}`}>
                        {optimization.readabilityScore}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
                <CardDescription>AI-powered recommendations to improve your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimization.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{suggestion.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {suggestion.type}
                          </Badge>
                          <Badge 
                            variant={suggestion.impact === 'high' ? 'destructive' : suggestion.impact === 'medium' ? 'secondary' : 'default'}
                          >
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimized">
            <Card>
              <CardHeader>
                <CardTitle>AI-Optimized Content</CardTitle>
                <CardDescription>Enhanced version of your content with SEO and readability improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Original Content</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {optimization.originalContent}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Optimized Content</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {optimization.optimizedContent}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>Keyword density and optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimization.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        {keyword.recommended ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{keyword.keyword}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {keyword.density}% density
                        </span>
                        <Badge variant={keyword.recommended ? 'default' : 'secondary'}>
                          {keyword.recommended ? 'Optimal' : 'Needs work'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Metadata</CardTitle>
                <CardDescription>SEO-optimized titles, descriptions, and tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Optimized Title</label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{optimization.metadata.title}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{optimization.metadata.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recommended Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {optimization.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIContentOptimizer;