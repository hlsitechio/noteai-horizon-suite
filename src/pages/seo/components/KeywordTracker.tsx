import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KeywordTracker: React.FC = () => {
  const [newKeyword, setNewKeyword] = useState('');

  const keywords = [
    {
      keyword: 'note taking app',
      position: 3,
      previousPosition: 5,
      searchVolume: '12K',
      difficulty: 'Medium',
      traffic: '1.2K',
      url: '/features'
    },
    {
      keyword: 'productivity tools',
      position: 7,
      previousPosition: 8,
      searchVolume: '8.5K',
      difficulty: 'High',
      traffic: '850',
      url: '/dashboard'
    },
    {
      keyword: 'digital notebook',
      position: 12,
      previousPosition: 9,
      searchVolume: '5.2K',
      difficulty: 'Low',
      traffic: '520',
      url: '/editor'
    },
    {
      keyword: 'AI writing assistant',
      position: 5,
      previousPosition: 9,
      searchVolume: '15K',
      difficulty: 'High',
      traffic: '1.8K',
      url: '/ai-features'
    }
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Keyword</CardTitle>
          <CardDescription>Track a new keyword's ranking performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword to track..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Keywords ({keywords.length})</CardTitle>
          <CardDescription>Monitor your keyword rankings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Keyword</th>
                  <th className="text-left py-3 px-2">Position</th>
                  <th className="text-left py-3 px-2">Trend</th>
                  <th className="text-left py-3 px-2">Search Volume</th>
                  <th className="text-left py-3 px-2">Difficulty</th>
                  <th className="text-left py-3 px-2">Traffic</th>
                  <th className="text-left py-3 px-2">Landing Page</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.keyword}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline">#{item.position}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.position, item.previousPosition)}
                        <span className="text-sm text-muted-foreground">
                          {Math.abs(item.position - item.previousPosition)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">{item.searchVolume}</td>
                    <td className="py-3 px-2">
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">{item.traffic}</td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">{item.url}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};