import React from 'react';
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
  FileText
} from 'lucide-react';

export const TechnicalSEO: React.FC = () => {
  const technicalChecks = [
    {
      category: 'Core Web Vitals',
      icon: Zap,
      checks: [
        { name: 'Largest Contentful Paint (LCP)', status: 'good', value: '1.2s', threshold: '< 2.5s' },
        { name: 'First Input Delay (FID)', status: 'warning', value: '120ms', threshold: '< 100ms' },
        { name: 'Cumulative Layout Shift (CLS)', status: 'good', value: '0.08', threshold: '< 0.1' }
      ]
    },
    {
      category: 'Page Speed',
      icon: Clock,
      checks: [
        { name: 'Desktop Speed Score', status: 'good', value: '89', threshold: '> 90' },
        { name: 'Mobile Speed Score', status: 'warning', value: '76', threshold: '> 90' },
        { name: 'Time to Interactive', status: 'error', value: '4.2s', threshold: '< 3.8s' }
      ]
    },
    {
      category: 'Mobile Optimization',
      icon: Smartphone,
      checks: [
        { name: 'Mobile-Friendly Test', status: 'good', value: 'Pass', threshold: 'Pass' },
        { name: 'Viewport Meta Tag', status: 'good', value: 'Present', threshold: 'Required' },
        { name: 'Touch Elements', status: 'good', value: 'Adequate', threshold: 'Adequate' }
      ]
    },
    {
      category: 'Security & HTTPS',
      icon: Shield,
      checks: [
        { name: 'HTTPS Certificate', status: 'good', value: 'Valid', threshold: 'Valid' },
        { name: 'SSL Rating', status: 'good', value: 'A+', threshold: 'A or higher' },
        { name: 'Mixed Content', status: 'good', value: 'None', threshold: 'None' }
      ]
    }
  ];

  const crawlIssues = [
    { type: 'error', title: 'Broken Internal Links', count: 5, icon: Link },
    { type: 'warning', title: 'Missing Alt Text', count: 12, icon: Image },
    { type: 'warning', title: 'Large Image Files', count: 8, icon: Image },
    { type: 'error', title: 'Missing H1 Tags', count: 3, icon: FileText }
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
              <span className="text-2xl font-bold">82/100</span>
            </div>
            <Progress value={82} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Desktop</p>
                <p className="text-lg font-bold">89</p>
              </div>
              <div className="text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-lg font-bold">76</p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium">Core Vitals</p>
                <p className="text-lg font-bold">2/3</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">Security</p>
                <p className="text-lg font-bold">100</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};