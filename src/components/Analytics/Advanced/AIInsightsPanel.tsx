import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Trophy,
  ChevronRight,
  Lightbulb,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AIInsights } from '@/types/analytics';

interface AIInsightsPanelProps {
  insights: AIInsights[];
  loading?: boolean;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  loading = false
}) => {
  const getInsightIcon = (type: AIInsights['type']) => {
    switch (type) {
      case 'trend':
        return TrendingUp;
      case 'recommendation':
        return Lightbulb;
      case 'achievement':
        return Trophy;
      case 'warning':
        return AlertTriangle;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: AIInsights['type'], impact: AIInsights['impact']) => {
    if (type === 'achievement') return 'text-green-600 bg-green-500/10 border-green-500/20';
    if (type === 'warning') return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    if (impact === 'high') return 'text-purple-600 bg-purple-500/10 border-purple-500/20';
    if (impact === 'medium') return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
  };

  const getImpactBadge = (impact: AIInsights['impact']) => {
    const variants = {
      high: 'bg-red-500/10 text-red-600 border-red-500/20',
      medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      low: 'bg-green-500/10 text-green-600 border-green-500/20'
    };
    
    return variants[impact] || variants.low;
  };

  const sortedInsights = insights.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact] || b.confidence - a.confidence;
  });

  if (loading) {
    return (
      <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-border/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Insights
            <Badge variant="secondary" className="ml-2">
              {insights.length}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Personalized insights powered by AI analysis
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {sortedInsights.length === 0 ? (
          <div className="p-6 text-center">
            <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No insights available yet. Keep writing to generate AI-powered insights!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {sortedInsights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              const colorClasses = getInsightColor(insight.type, insight.impact);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                          {insight.title}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getImpactBadge(insight.impact)}`}
                          >
                            {insight.impact}
                          </Badge>
                          
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                        {insight.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs capitalize">
                          {insight.category}
                        </Badge>
                        
                        {insight.actionable && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Take Action
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {sortedInsights.length > 0 && (
          <div className="p-4 border-t border-border/10 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Insights updated every 5 minutes
              </span>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                View All Insights
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;