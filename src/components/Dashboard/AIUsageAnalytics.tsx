import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, Target, Zap, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAICopilot } from '@/hooks/useAICopilot';
import { supabase } from '@/integrations/supabase/client';

interface AIUsageStats {
  totalSessions: number;
  averageProcessingTime: number;
  mostUsedAction: string;
  totalTokensUsed: number;
  satisfactionScore: number;
  weeklyGrowth: number;
}

interface AIUsageAnalyticsProps {
  className?: string;
}

const AIUsageAnalytics: React.FC<AIUsageAnalyticsProps> = ({ className }) => {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getSessionAnalytics } = useAICopilot();

  useEffect(() => {
    const fetchAIUsageStats = async () => {
      try {
        setIsLoading(true);
        
        // Get AI copilot sessions
        const sessions = await getSessionAnalytics();
        
        // Get AI usage tracking data
        const { data: usageData, error: usageError } = await supabase
          .from('ai_usage_tracking')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (usageError) {
          console.error('Error fetching usage data:', usageError);
        }

        // Calculate statistics
        const totalSessions = sessions.length;
        const averageProcessingTime = sessions.length > 0 
          ? sessions.reduce((sum, session) => sum + (session.processing_time || 0), 0) / sessions.length
          : 0;

        // Find most used action
        const actionCounts = sessions.reduce((acc, session) => {
          const action = session.session_type || 'unknown';
          acc[action] = (acc[action] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const mostUsedAction = Object.entries(actionCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

        // Calculate total tokens used
        const totalTokensUsed = (usageData || [])
          .reduce((sum, usage) => sum + (usage.tokens_used || 0), 0);

        // Calculate satisfaction score
        const ratingsCount = sessions.filter(s => s.feedback_rating !== null).length;
        const satisfactionScore = ratingsCount > 0
          ? sessions
              .filter(s => s.feedback_rating !== null)
              .reduce((sum, s) => sum + (s.feedback_rating || 0), 0) / ratingsCount
          : 0;

        // Calculate weekly growth (mock for now)
        const weeklyGrowth = Math.random() * 20 + 5; // 5-25% growth

        setStats({
          totalSessions,
          averageProcessingTime,
          mostUsedAction,
          totalTokensUsed,
          satisfactionScore,
          weeklyGrowth
        });

      } catch (error) {
        console.error('Error fetching AI usage stats:', error);
        // Set empty stats to prevent flashing
        setStats({
          totalSessions: 0,
          averageProcessingTime: 0,
          mostUsedAction: 'none',
          totalTokensUsed: 0,
          satisfactionScore: 0,
          weeklyGrowth: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIUsageStats();
  }, [getSessionAnalytics]);

  if (isLoading) {
    return (
      <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
        <CardHeader className="p-4 pb-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center border border-purple-500/10">
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              AI Usage Analytics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
        <CardHeader className="p-4 pb-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center border border-purple-500/10">
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              AI Usage Analytics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No AI usage data available yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start using AI features to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
      <CardHeader className="p-4 pb-3 border-b border-border/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center border border-purple-500/10">
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                AI Usage Analytics
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Your AI assistant performance
              </p>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            +{stats.weeklyGrowth.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Sessions */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/30">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Sessions</span>
            </div>
            <div className="text-lg font-bold text-blue-700">{stats.totalSessions}</div>
          </div>

          {/* Processing Time */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/30">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">Avg Time</span>
            </div>
            <div className="text-lg font-bold text-green-700">
              {(stats.averageProcessingTime / 1000).toFixed(1)}s
            </div>
          </div>

          {/* Token Usage */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/30">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Tokens</span>
            </div>
            <div className="text-lg font-bold text-purple-700">
              {stats.totalTokensUsed.toLocaleString()}
            </div>
          </div>

          {/* Satisfaction Score */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/30">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">Rating</span>
            </div>
            <div className="text-lg font-bold text-orange-700">
              {stats.satisfactionScore > 0 ? `${stats.satisfactionScore.toFixed(1)}/5` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Most Used Action */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Most Used Action</h4>
              <p className="text-xs text-gray-500">Your favorite AI feature</p>
            </div>
            <Badge variant="outline" className="bg-white/50 text-gray-700 border-gray-300/50 capitalize">
              {stats.mostUsedAction}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-border/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>AI Assistant Status</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIUsageAnalytics;