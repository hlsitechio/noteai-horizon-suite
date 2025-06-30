
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Database, 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lightbulb,
  Target
} from 'lucide-react';
import { useQueryPerformanceMonitor } from '@/hooks/useQueryPerformanceMonitor';

const PerformanceDashboard: React.FC = () => {
  const { getPerformanceReport, getOptimizationPlan, analyzePerformance, getRecommendations } = useQueryPerformanceMonitor();
  const [report, setReport] = useState<any>(null);
  const [optimizationPlan, setOptimizationPlan] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const performanceReport = getPerformanceReport();
      const plan = await getOptimizationPlan();
      const recs = await getRecommendations();
      
      setReport(performanceReport);
      setOptimizationPlan(plan);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      default: return 'border-blue-500';
    }
  };

  const calculateHealthScore = () => {
    if (!report || !optimizationPlan) return 0;
    
    let score = 100;
    const issues = optimizationPlan.issues || [];
    
    issues.forEach((issue: any) => {
      switch (issue.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        default: score -= 5; break;
      }
    });

    return Math.max(0, score);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading performance data...</span>
        </div>
      </div>
    );
  }

  const healthScore = calculateHealthScore();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="w-8 h-8" />
          Database Performance Dashboard
        </h1>
        <Button onClick={refreshData} disabled={isLoading}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Database Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={healthScore} className="h-3" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{healthScore}%</span>
              {healthScore >= 80 ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {healthScore >= 80 
              ? "Your database is performing well!" 
              : healthScore >= 60 
                ? "Some optimization opportunities exist."
                : "Immediate attention required for performance issues."
            }
          </p>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {optimizationPlan?.issues?.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{optimizationPlan.issues.length} performance issues detected</strong>
            <div className="mt-2 space-y-1">
              {optimizationPlan.issues.slice(0, 3).map((issue: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge className={getSeverityColor(issue.severity)}>
                    {issue.severity}
                  </Badge>
                  <span className="text-sm">{issue.type.replace('_', ' ')}: {issue.query}</span>
                </div>
              ))}
              {optimizationPlan.issues.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{optimizationPlan.issues.length - 3} more issues
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.totalQueries || 0}</div>
            <p className="text-xs text-muted-foreground">
              {report?.totalCalls || 0} total executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Execution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(report?.totalExecutionTime || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cumulative query time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slowest Query</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(report?.slowestExecution?.[0]?.slowestExecution || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Single execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report?.totalErrors || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Failed queries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queries">Top Queries</TabsTrigger>
          <TabsTrigger value="optimization">Action Plan</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Active Connections:</span>
                  <span className="font-mono">{report?.connectionMetrics?.activeConnections || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Connections:</span>
                  <span className="font-mono">{report?.connectionMetrics?.totalConnections || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Connections:</span>
                  <span className="font-mono text-red-500">{report?.connectionMetrics?.failedConnections || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pool Utilization:</span>
                  <span className="font-mono">{((report?.connectionMetrics?.poolUtilization || 0) * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Average Query Time:</span>
                  <span className="font-mono">
                    {formatTime((report?.totalExecutionTime || 0) / Math.max(1, report?.totalCalls || 1))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-mono text-green-500">
                    {(((report?.totalCalls || 0) - (report?.totalErrors || 0)) / Math.max(1, report?.totalCalls || 1) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Queries/Second:</span>
                  <span className="font-mono">
                    {((report?.totalCalls || 0) / 3600).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Time Consuming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report?.mostTimeConsuming?.slice(0, 5).map((query: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-mono truncate flex-1 mr-2">{query.query}</span>
                      <Badge variant="outline">{formatTime(query.totalTime)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Frequent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report?.mostFrequent?.slice(0, 5).map((query: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-mono truncate flex-1 mr-2">{query.query}</span>
                      <Badge variant="outline">{query.callCount} calls</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slowest Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report?.slowestExecution?.slice(0, 5).map((query: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-mono truncate flex-1 mr-2">{query.query}</span>
                      <Badge variant="destructive">{formatTime(query.slowestExecution)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Queries with Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report?.highestErrors?.slice(0, 5).map((query: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-mono truncate flex-1 mr-2">{query.query}</span>
                      <Badge variant="destructive">{query.errorCount} errors</Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No query errors detected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimizationPlan?.plan && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.immediateActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Short-term Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.shortTermActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Long-term Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.longTermActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Monitoring Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.monitoringSetup.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations?.map((rec: any, index: number) => (
              <Card key={index} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {rec.category}
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                      {rec.priority} priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-3">
                    {rec.actions.map((action: string, actionIndex: number) => (
                      <li key={actionIndex} className="flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-muted p-2 rounded text-xs">
                    <strong>Expected Impact:</strong> {rec.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="space-y-2">
            {optimizationPlan?.issues?.map((issue: any, index: number) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <strong>{issue.type.replace('_', ' ').toUpperCase()}</strong>
                    </div>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Query:</strong> <code className="bg-muted px-1 rounded">{issue.query}</code>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {issue.slowestTime && <span>Slowest: {formatTime(issue.slowestTime)} • </span>}
                    {issue.callCount && <span>Calls: {issue.callCount} • </span>}
                    {issue.totalTime && <span>Total: {formatTime(issue.totalTime)} • </span>}
                    {issue.errorRate && <span>Error Rate: {issue.errorRate.toFixed(1)}%</span>}
                  </div>
                  {issue.recommendation && (
                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
