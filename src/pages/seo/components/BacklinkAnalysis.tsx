import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ExternalLink, 
  TrendingUp, 
  Star, 
  Globe, 
  Users, 
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const BacklinkAnalysis: React.FC = () => {
  const backlinkStats = {
    totalBacklinks: 1247,
    referringDomains: 89,
    domainAuthority: 72,
    trustFlow: 68,
    newBacklinks: 23,
    lostBacklinks: 8
  };

  const topBacklinks = [
    {
      domain: 'techcrunch.com',
      url: 'https://techcrunch.com/productivity-tools-2024',
      authority: 95,
      traffic: 'High',
      linkType: 'Editorial',
      anchor: 'best note-taking app',
      status: 'active'
    },
    {
      domain: 'producthunt.com',
      url: 'https://producthunt.com/posts/note-ai',
      authority: 88,
      traffic: 'Medium',
      linkType: 'Directory',
      anchor: 'AI-powered notes',
      status: 'active'
    },
    {
      domain: 'medium.com',
      url: 'https://medium.com/@author/productivity-guide',
      authority: 76,
      traffic: 'Medium',
      linkType: 'Guest Post',
      anchor: 'digital workspace',
      status: 'active'
    },
    {
      domain: 'zapier.com',
      url: 'https://zapier.com/blog/note-taking-tools',
      authority: 91,
      traffic: 'High',
      linkType: 'Editorial',
      anchor: 'productivity software',
      status: 'lost'
    }
  ];

  const linkOpportunities = [
    {
      domain: 'notion.so',
      authority: 85,
      relevance: 'High',
      difficulty: 'Medium',
      opportunity: 'Guest Post',
      potentialTraffic: '2.5K'
    },
    {
      domain: 'lifehacker.com',
      authority: 78,
      relevance: 'High',
      difficulty: 'Hard',
      opportunity: 'Product Review',
      potentialTraffic: '4.1K'
    },
    {
      domain: 'worklife.news',
      authority: 62,
      relevance: 'Medium',
      difficulty: 'Easy',
      opportunity: 'Partnership',
      potentialTraffic: '1.2K'
    }
  ];

  const getAuthorityColor = (authority: number) => {
    if (authority >= 80) return 'text-green-600 bg-green-100';
    if (authority >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium text-muted-foreground">Total Backlinks</p>
            </div>
            <div className="flex items-end space-x-2 mt-2">
              <p className="text-2xl font-bold">{backlinkStats.totalBacklinks.toLocaleString()}</p>
              <p className="text-sm font-medium text-green-500">+{backlinkStats.newBacklinks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-medium text-muted-foreground">Referring Domains</p>
            </div>
            <div className="flex items-end space-x-2 mt-2">
              <p className="text-2xl font-bold">{backlinkStats.referringDomains}</p>
              <p className="text-sm font-medium text-green-500">+5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <p className="text-sm font-medium text-muted-foreground">Domain Authority</p>
            </div>
            <div className="flex items-end space-x-2 mt-2">
              <p className="text-2xl font-bold">{backlinkStats.domainAuthority}</p>
              <p className="text-sm font-medium text-green-500">+2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Backlinks</CardTitle>
          <CardDescription>Your highest-value referring domains and links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Domain</th>
                  <th className="text-left py-3 px-2">Authority</th>
                  <th className="text-left py-3 px-2">Traffic</th>
                  <th className="text-left py-3 px-2">Link Type</th>
                  <th className="text-left py-3 px-2">Anchor Text</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topBacklinks.map((link, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{link.domain}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getAuthorityColor(link.authority)}>
                        {link.authority}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getTrafficColor(link.traffic)}>
                        {link.traffic}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{link.linkType}</td>
                    <td className="py-3 px-2">
                      <span className="text-sm">{link.anchor}</span>
                    </td>
                    <td className="py-3 px-2">
                      {link.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Link Building Opportunities</CardTitle>
          <CardDescription>Potential high-value backlink prospects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {linkOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{opportunity.domain}</span>
                    <Badge className={getAuthorityColor(opportunity.authority)}>
                      DA {opportunity.authority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{opportunity.opportunity}</Badge>
                    <Badge className={getDifficultyColor(opportunity.difficulty)}>
                      {opportunity.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Est. Traffic: {opportunity.potentialTraffic}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Pursue
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backlink Health Overview</CardTitle>
          <CardDescription>Monitor your link profile quality and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Link Profile Health</span>
                <span className="text-2xl font-bold">85/100</span>
              </div>
              <Progress value={85} className="w-full mb-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>High Authority Links (80+)</span>
                  <span>12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Medium Authority Links (50-80)</span>
                  <span>65%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Low Authority Links (&lt;50)</span>
                  <span>23%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium">Monthly Growth</p>
                <p className="text-lg font-bold">+15 domains</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Trust Flow</p>
                <p className="text-lg font-bold">{backlinkStats.trustFlow}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};