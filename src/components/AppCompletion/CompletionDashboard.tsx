
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppCompletion } from '@/hooks/useAppCompletion';
import { TestingDashboard } from '@/components/Testing/TestingDashboard';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Users, 
  RefreshCw,
  TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CompletionDashboard: React.FC = () => {
  const { 
    metrics, 
    isLoading, 
    lastUpdated, 
    refreshMetrics, 
    runHealthCheck,
    getCompletionStatus 
  } = useAppCompletion();

  const completionStatus = getCompletionStatus();

  const scoreCards = [
    {
      title: 'Testing Health',
      score: metrics.testingScore,
      icon: CheckCircle2,
      description: 'Component tests and functionality',
      color: metrics.testingScore >= 80 ? 'text-green-600' : metrics.testingScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: 'Error Management',
      score: metrics.errorScore,
      icon: AlertTriangle,
      description: 'Error handling and stability',
      color: metrics.errorScore >= 80 ? 'text-green-600' : metrics.errorScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: 'Performance',
      score: metrics.performanceScore,
      icon: Zap,
      description: 'Bundle size and loading speed',
      color: metrics.performanceScore >= 80 ? 'text-green-600' : metrics.performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      title: 'User Experience',
      score: metrics.onboardingScore,
      icon: Users,
      description: 'Onboarding and user guidance',
      color: metrics.onboardingScore >= 80 ? 'text-green-600' : metrics.onboardingScore >= 60 ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Completion</h1>
          <p className="text-muted-foreground">
            Track your progress toward a production-ready application
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshMetrics}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Run Health Check
          </Button>
        </div>
      </div>

      {/* Overall Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Completion
            <Badge 
              variant={completionStatus.status === 'excellent' ? 'default' : 
                      completionStatus.status === 'good' ? 'secondary' : 
                      completionStatus.status === 'fair' ? 'outline' : 'destructive'}
            >
              {Math.round(metrics.overallCompletion)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={metrics.overallCompletion} className="h-3" />
          <p className={`text-sm ${completionStatus.color}`}>
            {completionStatus.message}
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                      <span className={`text-2xl font-bold ${card.color}`}>
                        {Math.round(card.score)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={card.score} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      {metrics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <Badge 
                    variant={rec.priority === 'high' ? 'destructive' : 
                            rec.priority === 'medium' ? 'default' : 'secondary'}
                    className="mt-0.5"
                  >
                    {rec.priority}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testing Dashboard */}
      <TestingDashboard />
    </div>
  );
};
