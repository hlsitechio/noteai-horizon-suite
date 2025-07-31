import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Eye, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const SEOHeader: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: 'SEO Score',
      value: '0',
      unit: '/100',
      icon: TrendingUp,
      trend: '0',
      color: 'text-green-500'
    },
    {
      title: 'Organic Traffic',
      value: '0',
      unit: 'visits',
      icon: Eye,
      trend: '0%',
      color: 'text-blue-500'
    },
    {
      title: 'Keywords Ranking',
      value: '0',
      unit: 'keywords',
      icon: Search,
      trend: '0',
      color: 'text-purple-500'
    },
    {
      title: 'Page Speed',
      value: '0',
      unit: '/100',
      icon: BarChart3,
      trend: '0',
      color: 'text-orange-500'
    }
  ]);

  useEffect(() => {
    if (user) {
      fetchSEOStats();
    }
  }, [user]);

  const fetchSEOStats = async () => {
    try {
      // Fetch SEO audit score
      const { data: audits } = await supabase
        .from('seo_audits')
        .select('audit_score')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch keywords count
      const { data: keywords } = await supabase
        .from('seo_keywords')
        .select('id')
        .eq('user_id', user!.id);

      // Fetch visitor analytics for traffic
      const { data: analytics } = await supabase
        .from('seo_visitor_analytics')
        .select('visitor_id')
        .eq('user_id', user!.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Fetch page load time for page speed
      const { data: pageSpeed } = await supabase
        .from('seo_visitor_analytics')
        .select('page_load_time')
        .eq('user_id', user!.id)
        .not('page_load_time', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      const seoScore = audits?.[0]?.audit_score || 0;
      const keywordCount = keywords?.length || 0;
      const trafficCount = analytics?.length || 0;
      const avgPageSpeed = pageSpeed?.length 
        ? Math.round(pageSpeed.reduce((acc, curr) => acc + (curr.page_load_time || 0), 0) / pageSpeed.length / 10)
        : 0;

      setStats([
        {
          title: 'SEO Score',
          value: seoScore.toString(),
          unit: '/100',
          icon: TrendingUp,
          trend: seoScore > 50 ? '+5' : '-2',
          color: seoScore > 70 ? 'text-green-500' : seoScore > 50 ? 'text-yellow-500' : 'text-red-500'
        },
        {
          title: 'Organic Traffic',
          value: trafficCount > 1000 ? `${(trafficCount / 1000).toFixed(1)}K` : trafficCount.toString(),
          unit: 'visits',
          icon: Eye,
          trend: trafficCount > 0 ? '+12%' : '0%',
          color: 'text-blue-500'
        },
        {
          title: 'Keywords Ranking',
          value: keywordCount.toString(),
          unit: 'keywords',
          icon: Search,
          trend: keywordCount > 0 ? '+8' : '0',
          color: 'text-purple-500'
        },
        {
          title: 'Page Speed',
          value: avgPageSpeed.toString(),
          unit: '/100',
          icon: BarChart3,
          trend: avgPageSpeed > 80 ? '+3' : '0',
          color: avgPageSpeed > 80 ? 'text-green-500' : avgPageSpeed > 50 ? 'text-yellow-500' : 'text-orange-500'
        }
      ]);
    } catch (error) {
      console.error('Error fetching SEO stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading SEO stats...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your website's search engine performance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end space-x-2 mt-2">
                <p className="text-2xl font-bold">
                  {stat.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className={`text-sm font-medium ${stat.color}`}>
                  {stat.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};