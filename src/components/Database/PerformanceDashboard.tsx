
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, TrendingUp, Clock, Zap } from 'lucide-react';
import { useQueryPerformanceMonitor } from '@/hooks/useQueryPerformanceMonitor';

const PerformanceDashboard: React.FC = () => {
  const { getPerformanceReport, getOptimizationPlan } = useQueryPerformanceMonitor();
  const [report, setReport] = useState<any>(null);
  const [optimizationPlan, setOptimizationPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const performanceReport = getPerformanceReport();
      const plan = await getOptimizationPlan();
      
      setReport(performanceReport);
      setOptimizationPlan(plan);
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
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                  <span className="text-sm">{issue.type}: {issue.query}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.totalQueries || 0}</div>
            <p className="text-xs text-muted-foreground">
              {report?.totalCalls || 0} total calls
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
              Single query execution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Frequent</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report?.mostFrequent?.[0]?.callCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              calls for top query
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="top-queries" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="top-queries">Top Queries</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Plan</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="top-queries" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Time Consuming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report?.mostTimeConsuming?.slice(0, 5).map((query: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm font-mono truncate flex-1">{query.query}</span>
                      <Badge>{formatTime(query.totalTime)}</Badge>
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
                      <span className="text-sm font-mono truncate flex-1">{query.query}</span>
                      <Badge>{query.callCount} calls</Badge>
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
                      <span className="text-sm font-mono truncate flex-1">{query.query}</span>
                      <Badge variant="destructive">{formatTime(query.slowestExecution)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimizationPlan?.plan && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Immediate Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.immediateActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Short-term Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.shortTermActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Long-term Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.longTermActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Monitoring Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimizationPlan.plan.monitoringSetup.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="space-y-2">
            {optimizationPlan?.issues?.map((issue: any, index: number) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{issue.type.replace('_', ' ')}</strong>: {issue.query}
                    </div>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {issue.slowestTime && `Slowest: ${formatTime(issue.slowestTime)}`}
                    {issue.callCount && `Calls: ${issue.callCount}`}
                    {issue.totalTime && `Total: ${formatTime(issue.totalTime)}`}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Indexing Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Add composite indexes on frequently queried columns</li>
                  <li>• Create partial indexes for filtered queries</li>
                  <li>• Add text search indexes for content searches</li>
                  <li>• Monitor index usage and remove unused ones</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use query batching for multiple operations</li>
                  <li>• Implement pagination for large result sets</li>
                  <li>• Add query result caching</li>
                  <li>• Use materialized views for complex aggregations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Implement connection pooling</li>
                  <li>• Reduce database round trips</li>
                  <li>• Use prepared statements</li>
                  <li>• Optimize transaction boundaries</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
