import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  Brain, 
  CheckCircle, 
  Clock,
  Lightbulb,
  BarChart3,
  Search,
  Users,
  FileText,
  Gauge
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SEORecommendation {
  id: string;
  page_path: string;
  recommendation_type: string;
  priority: string;
  title: string;
  description: string;
  action_items: string[];
  impact_score: number;
  implementation_difficulty: string;
  is_implemented: boolean;
}

interface SEOAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  page_path?: string;
  keyword?: string;
  metric_value?: number;
  previous_value?: number;
  is_read: boolean;
  created_at: string;
}

interface ContentGap {
  id: string;
  keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  content_type_suggestion: string;
  content_outline: string;
  priority_score: number;
  is_targeted: boolean;
}

export const AdvancedSEOAssistant: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>([]);
  const [alerts, setAlerts] = useState<SEOAlert[]>([]);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSEOData = async () => {
    if (!user) return;

    try {
      const [recsRes, alertsRes, gapsRes] = await Promise.all([
        supabase.from('seo_recommendations').select('*').eq('user_id', user.id).order('impact_score', { ascending: false }),
        supabase.from('seo_alerts').select('*').eq('user_id', user.id).eq('is_read', false).order('created_at', { ascending: false }).limit(10),
        supabase.from('seo_content_gaps').select('*').eq('user_id', user.id).eq('is_targeted', false).order('priority_score', { ascending: false }).limit(5)
      ]);

      if (recsRes.error) throw recsRes.error;
      if (alertsRes.error) throw alertsRes.error;
      if (gapsRes.error) throw gapsRes.error;

      setRecommendations(recsRes.data || []);
      setAlerts(alertsRes.data || []);
      setContentGaps(gapsRes.data || []);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      toast.error('Failed to load SEO insights');
    } finally {
      setLoading(false);
    }
  };

  const markRecommendationComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_recommendations')
        .update({ is_implemented: true })
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev => prev.map(rec => 
        rec.id === id ? { ...rec, is_implemented: true } : rec
      ));
      toast.success('Recommendation marked as complete!');
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast.error('Failed to update recommendation');
    }
  };

  const markAlertRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_alerts')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const targetContentGap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_content_gaps')
        .update({ is_targeted: true })
        .eq('id', id);

      if (error) throw error;

      setContentGaps(prev => prev.filter(gap => gap.id !== id));
      toast.success('Content opportunity added to your roadmap!');
    } catch (error) {
      console.error('Error targeting content gap:', error);
      toast.error('Failed to target content opportunity');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'hard': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return <FileText className="h-4 w-4" />;
      case 'technical': return <Gauge className="h-4 w-4" />;
      case 'keywords': return <Search className="h-4 w-4" />;
      case 'backlinks': return <Users className="h-4 w-4" />;
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchSEOData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading SEO insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Alerts Banner */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              SEO Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => markAlertRead(alert.id)}>
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Content Gaps
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Competitor Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered SEO Recommendations
              </CardTitle>
              <CardDescription>
                Smart suggestions to boost your search rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recommendations available. My AI is analyzing your site...
                  </p>
                ) : (
                  recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(rec.recommendation_type)}
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">{rec.recommendation_type}</Badge>
                            {getDifficultyIcon(rec.implementation_difficulty)}
                          </div>
                          <h4 className="font-semibold mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Impact Score:</span>
                              <Progress value={rec.impact_score} className="w-20" />
                              <span className="text-sm">{rec.impact_score}%</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Page: {rec.page_path}
                            </span>
                          </div>
                          {rec.action_items.length > 0 && (
                            <div>
                              <span className="text-sm font-medium">Action Items:</span>
                              <ul className="text-sm text-muted-foreground mt-1 ml-4">
                                {rec.action_items.map((item, index) => (
                                  <li key={index} className="list-disc">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {!rec.is_implemented ? (
                            <Button 
                              size="sm" 
                              onClick={() => markRecommendationComplete(rec.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Gap Opportunities
              </CardTitle>
              <CardDescription>
                High-impact keywords your competitors rank for but you don't
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentGaps.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No content gaps identified yet. Analyzing competitor strategies...
                  </p>
                ) : (
                  contentGaps.map((gap) => (
                    <div key={gap.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{gap.content_type_suggestion}</Badge>
                            <Badge className="bg-purple-100 text-purple-800">
                              Priority: {gap.priority_score}%
                            </Badge>
                          </div>
                          <h4 className="font-semibold mb-2">"{gap.keyword}"</h4>
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div>
                              <span className="font-medium">Search Volume:</span> {gap.search_volume?.toLocaleString() || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Difficulty:</span> {gap.keyword_difficulty || 'N/A'}/100
                            </div>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-medium">Content Outline:</span>
                            <p className="text-sm text-muted-foreground mt-1">{gap.content_outline}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => targetContentGap(gap.id)}
                          className="ml-4"
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Target
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Competitor Intelligence
              </CardTitle>
              <CardDescription>
                Track your competition and discover their strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Notion', domain: 'notion.so', rank_overlap: 45, traffic_share: '32%' },
                  { name: 'Obsidian', domain: 'obsidian.md', rank_overlap: 38, traffic_share: '18%' },
                  { name: 'Roam Research', domain: 'roamresearch.com', rank_overlap: 22, traffic_share: '12%' }
                ].map((competitor) => (
                  <div key={competitor.domain} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{competitor.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Keyword Overlap:</span>
                        <span className="font-medium">{competitor.rank_overlap}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traffic Share:</span>
                        <span className="font-medium">{competitor.traffic_share}</span>
                      </div>
                      <Progress value={competitor.rank_overlap} className="mt-2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Deep Competitor Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};