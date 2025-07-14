import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Eye, Activity, FileText, Settings } from 'lucide-react';
import { rateLimiter } from '@/utils/securityUtils';
import { advancedThreatDetection } from '@/services/security/advancedThreatDetection';

interface SecurityAuditProps {
  className?: string;
}

export const SecurityAuditDashboard: React.FC<SecurityAuditProps> = ({ className }) => {
  const [stats, setStats] = useState<any>(null);
  const [threats, setThreats] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [rateLimitStats, setRateLimitStats] = useState<any>(null);

  useEffect(() => {
    const loadSecurityData = () => {
      // Get rate limiter statistics
      const rlStats = rateLimiter.getStats();
      const rlReport = rateLimiter.getSecurityReport();
      setRateLimitStats({ ...rlStats, ...rlReport });

      // Get threat detection data
      const threatStats = advancedThreatDetection.getThreatStatistics();
      const recentThreats = advancedThreatDetection.getRecentAlerts(20);
      
      setStats(threatStats);
      setThreats(recentThreats);
      setAlerts(recentThreats.filter(t => t.severity === 'high' || t.severity === 'critical'));
    };

    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: Date | number) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return date.toLocaleString();
  };

  if (!stats || !rateLimitStats) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-muted-foreground">Loading security audit data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalThreats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentThreats} in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rateLimitStats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">
              {rateLimitStats.activeViolations} active violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.max(95 - stats.criticalAlerts * 5 - stats.recentThreats, 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall system security
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Recent Threats</TabsTrigger>
          <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
          <TabsTrigger value="patterns">Suspicious Patterns</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Recent Security Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {threats.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No recent threats detected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threats.map((threat, index) => (
                      <div key={threat.id || index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(threat.timestamp)}
                          </span>
                        </div>
                        <div className="font-medium mb-1">{threat.message}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Source: {threat.source}
                        </div>
                        {threat.metadata && (
                          <div className="text-xs bg-muted p-2 rounded">
                            <pre>{JSON.stringify(threat.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Blocked IP Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {rateLimitStats.blockedIPs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No IPs currently blocked
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rateLimitStats.blockedIPs.map((blocked: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-medium">{blocked.ip}</span>
                          <Badge variant="destructive">BLOCKED</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Reason: {blocked.reason}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Blocked until: {formatTimestamp(blocked.blockedUntil)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Suspicious Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {rateLimitStats.topSuspiciousPatterns.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No suspicious patterns detected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rateLimitStats.topSuspiciousPatterns.map((pattern: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{pattern.pattern}</span>
                          <Badge variant={getSeverityColor(pattern.severity)}>
                            {pattern.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Detected {pattern.count} times
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Security Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <div>Audit logs will be available once database logging is configured</div>
                <Button variant="outline" className="mt-4" size="sm">
                  Configure Logging
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAuditDashboard;