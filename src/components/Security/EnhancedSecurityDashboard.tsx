/**
 * Enhanced Security Dashboard with real-time monitoring and analytics
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Key, 
  Clock, 
  Users, 
  TrendingUp,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { auditLogService } from '@/services/security/auditLogService';
import { sessionSecurityService } from '@/services/security/sessionSecurityService';
import { rateLimitingService } from '@/services/security/rateLimitingService';
import { apiKeySecurityService } from '@/services/security/apiKeySecurityService';
import { unifiedSecurityService } from '@/services/security';

interface SecurityMetrics {
  auditStats: any;
  sessionStats: any;
  rateLimitStats: any;
  apiKeyStats: any;
  overallStats: any;
}

export const EnhancedSecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  const loadSecurityMetrics = async () => {
    try {
      setRefreshing(true);
      
      const [auditStats, sessionStats, rateLimitStats, apiKeyStats, overallStats] = await Promise.all([
        auditLogService.getAuditStats(),
        sessionSecurityService.getSessionStats(),
        rateLimitingService.getStats(),
        apiKeySecurityService.getApiKeyStats(),
        unifiedSecurityService.getStats(),
      ]);

      setMetrics({
        auditStats,
        sessionStats,
        rateLimitStats,
        apiKeyStats,
        overallStats,
      });
    } catch (error) {
      console.error('Failed to load security metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSecurityMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSecurityMetrics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportSecurityReport = async () => {
    if (!metrics) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      metrics,
      summary: {
        totalEvents: metrics.auditStats.totalCachedEvents,
        highRiskEvents: metrics.auditStats.riskDistribution?.high || 0,
        activeSessions: metrics.sessionStats.activeSessions,
        suspiciousActivities: metrics.sessionStats.suspiciousUsers,
        rateLimitViolations: metrics.rateLimitStats.blockedIPs,
        apiKeyIssues: metrics.apiKeyStats.suspiciousKeys + metrics.apiKeyStats.keysNeedingRotation,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading security metrics...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load security metrics. Please try again.</AlertDescription>
      </Alert>
    );
  }

  const totalRiskEvents = Object.values(metrics.auditStats.riskDistribution || {})
    .reduce((sum: number, count: any) => sum + (count || 0), 0);

  const overallRiskScore = metrics.auditStats.highRiskPatterns > 0 ? 'High' : 
    metrics.sessionStats.suspiciousUsers > 0 ? 'Medium' : 'Low';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time security monitoring and threat analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSecurityMetrics}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportSecurityReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallRiskScore}</div>
            <Badge className={getRiskColor(overallRiskScore.toLowerCase())}>
              {overallRiskScore} Risk
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionStats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.sessionStats.suspiciousUsers} suspicious
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{String(totalRiskEvents)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.auditStats.recentEventCount} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Security</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.apiKeyStats.successRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.apiKeyStats.keysNeedingRotation} keys need rotation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="ratelimit">Rate Limiting</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="patterns">Threat Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Analysis</CardTitle>
              <CardDescription>Security events and risk analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(metrics.auditStats.riskDistribution || {}).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <div className="text-2xl font-bold">{String(count)}</div>
                      <Badge className={getRiskColor(level)}>{level}</Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Top Risk Patterns</h4>
                  <div className="space-y-2">
                    {metrics.auditStats.topPatterns?.map((pattern: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{pattern.pattern}</span>
                          <p className="text-sm text-muted-foreground">
                            {pattern.frequency} occurrences, {pattern.affectedUsers} users
                          </p>
                        </div>
                        <Badge className={getRiskColor(pattern.riskScore > 70 ? 'high' : 'medium')}>
                          Risk: {pattern.riskScore}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Security</CardTitle>
              <CardDescription>Active sessions and anomaly detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.sessionStats.activeSessions}</div>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.sessionStats.suspiciousUsers}</div>
                    <p className="text-sm text-muted-foreground">Suspicious Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {metrics.sessionStats.sessionDetails?.filter((s: any) => s.hasDeviceInfo).length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Tracked Devices</p>
                  </div>
                </div>

                {metrics.sessionStats.sessionDetails?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Recent Sessions</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {metrics.sessionStats.sessionDetails.slice(0, 10).map((session: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">User {session.userId.slice(0, 8)}...</span>
                            <p className="text-sm text-muted-foreground">
                              Last active: {new Date(session.lastActivity).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {session.hasDeviceInfo && (
                              <Badge variant="outline">Device Tracked</Badge>
                            )}
                            {session.needsRotation && (
                              <Badge variant="destructive">Rotation Needed</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratelimit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Request throttling and abuse prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.rateLimitStats.activeLimits}</div>
                    <p className="text-sm text-muted-foreground">Active Limits</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.rateLimitStats.blockedIPs}</div>
                    <p className="text-sm text-muted-foreground">Blocked IPs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.rateLimitStats.suspiciousPatterns}</div>
                    <p className="text-sm text-muted-foreground">Suspicious Patterns</p>
                  </div>
                </div>

                {metrics.rateLimitStats.limits?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Current Rate Limits</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {metrics.rateLimitStats.limits.slice(0, 10).map((limit: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{limit.key}</span>
                            <p className="text-sm text-muted-foreground">
                              {limit.count} requests, {limit.violations} violations
                            </p>
                          </div>
                          <Progress value={(limit.count / 100) * 100} className="w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Security</CardTitle>
              <CardDescription>API key monitoring and rotation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.apiKeyStats.totalKeys}</div>
                    <p className="text-sm text-muted-foreground">Total Keys</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.apiKeyStats.activeKeys}</div>
                    <p className="text-sm text-muted-foreground">Active Keys</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.apiKeyStats.keysNeedingRotation}</div>
                    <p className="text-sm text-muted-foreground">Need Rotation</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {(metrics.apiKeyStats.successRate * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </div>

                {metrics.apiKeyStats.keyDetails?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">API Key Status</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {metrics.apiKeyStats.keyDetails.map((key: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{key.maskedKey}</span>
                            <p className="text-sm text-muted-foreground">
                              {key.source} • {key.usageCount} uses • {key.daysSinceCreation} days old
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {key.needsRotation && (
                              <Badge variant="destructive">Rotation Needed</Badge>
                            )}
                            {key.lastUsed && (
                              <Badge variant="outline">Recently Used</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Pattern Analysis</CardTitle>
              <CardDescription>AI-powered threat detection and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Pattern Detection Active</AlertTitle>
                  <AlertDescription>
                    AI algorithms are continuously analyzing user behavior patterns for anomalies and potential threats.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.auditStats.activePatterns}</div>
                    <p className="text-sm text-muted-foreground">Active Patterns</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics.auditStats.highRiskPatterns}</div>
                    <p className="text-sm text-muted-foreground">High Risk Patterns</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Pattern Detection Rules</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <h5 className="font-medium">Rapid Request Detection</h5>
                      <p className="text-sm text-muted-foreground">
                        Monitors for unusual spikes in request volume from individual users or IPs
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <h5 className="font-medium">Session Anomaly Detection</h5>
                      <p className="text-sm text-muted-foreground">
                        Detects unusual login patterns, device changes, and location anomalies
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <h5 className="font-medium">Failed Authentication Analysis</h5>
                      <p className="text-sm text-muted-foreground">
                        Tracks failed login attempts and potential brute force attacks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};