import React, { useState } from 'react';
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
  Hash
} from 'lucide-react';

export const ContentOptimization: React.FC = () => {
  const [targetKeyword, setTargetKeyword] = useState('');
  const [contentText, setContentText] = useState('');

  const contentAnalysis = {
    score: 75,
    wordCount: 1247,
    readabilityScore: 82,
    keywordDensity: 2.3,
    readingTime: '5 min',
    recommendations: [
      {
        type: 'warning',
        title: 'Add more internal links',
        description: 'Include 2-3 more internal links to related content',
        icon: AlertCircle
      },
      {
        type: 'error',
        title: 'Missing meta description',
        description: 'Add a compelling meta description (150-160 characters)',
        icon: AlertCircle
      },
      {
        type: 'success',
        title: 'Good keyword usage',
        description: 'Target keyword appears in title and headers',
        icon: CheckCircle
      },
      {
        type: 'warning',
        title: 'Optimize image alt text',
        description: '3 images missing descriptive alt text',
        icon: AlertCircle
      }
    ]
  };

  const topPerformingContent = [
    {
      title: 'How to Organize Your Digital Notes Effectively',
      url: '/blog/organize-digital-notes',
      views: '12.4K',
      position: 3,
      keywordTarget: 'digital note organization'
    },
    {
      title: 'AI-Powered Note Taking: The Future of Productivity',
      url: '/blog/ai-note-taking',
      views: '8.7K',
      position: 5,
      keywordTarget: 'AI note taking'
    },
    {
      title: 'Best Practices for Team Collaboration',
      url: '/blog/team-collaboration',
      views: '6.2K',
      position: 8,
      keywordTarget: 'team collaboration tools'
    }
  ];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

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