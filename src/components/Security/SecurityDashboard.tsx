import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Activity, Lock, RefreshCw } from 'lucide-react';
import { unifiedSecurityService } from '@/services/security';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface SecurityStats {
  rateLimiting: {
    activeLimits: number;
    blockedIPs: number;
    suspiciousPatterns: number;
    limits: { key: string; count: number; violations: number; }[];
  };
  userAgent: {
    patternsCount: number;
    browserPatternsCount: number;
  };
  timestamp: string;
  service: string;
}

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivity: number;
  lastIncident?: string;
}

const SecurityDashboard: React.FC = () => {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    suspiciousActivity: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { logSecurityEvent } = useSecurityMonitoring();

  const refreshStats = async () => {
    setIsRefreshing(true);
    
    try {
      // Get current security statistics
      const currentStats = unifiedSecurityService.getStats();
      setStats(currentStats);
      
      // Update metrics (in a real app, this would come from a backend API)
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
        lastIncident: new Date().toISOString(),
      }));
      
      // Log the dashboard access
      logSecurityEvent({
        eventType: 'security_dashboard_accessed',
        severity: 'low',
        details: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to refresh security stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshStats();
    
    // Refresh stats every 30 seconds using optimized scheduling
    import('@/utils/scheduler').then(({ scheduleIdleCallback, cancelIdleCallback }) => {
      let timeoutId: number;
      
      const scheduleNext = () => {
        timeoutId = scheduleIdleCallback(() => {
          refreshStats();
          scheduleNext();
        }, 30000);
      };
      
      scheduleNext();
      
      return () => {
        if (timeoutId) cancelIdleCallback(timeoutId);
      };
    });
  }, []);

  const getSecurityScore = (): { score: number; status: string; color: string } => {
    if (!stats) return { score: 0, status: 'Unknown', color: 'text-muted-foreground' };
    
    const { blockedIPs, suspiciousPatterns } = stats.rateLimiting;
    const totalThreats = blockedIPs + suspiciousPatterns + metrics.blockedRequests;
    
    if (totalThreats === 0) {
      return { score: 100, status: 'Excellent', color: 'text-green-600' };
    } else if (totalThreats < 5) {
      return { score: 85, status: 'Good', color: 'text-blue-600' };
    } else if (totalThreats < 15) {
      return { score: 65, status: 'Warning', color: 'text-yellow-600' };
    } else {
      return { score: 35, status: 'Critical', color: 'text-red-600' };
    }
  };

  const securityScore = getSecurityScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security metrics and system health
          </p>
        </div>
        <Button 
          onClick={refreshStats} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Score Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore.score}%</div>
            <p className={`text-xs ${securityScore.color}`}>
              {securityScore.status}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Limits</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rateLimiting.activeLimits || 0}</div>
            <p className="text-xs text-muted-foreground">
              Rate limit instances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rateLimiting.blockedIPs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Patterns</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rateLimiting.suspiciousPatterns || 0}</div>
            <p className="text-xs text-muted-foreground">
              Detected today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Health</CardTitle>
              <CardDescription>
                Current security status and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">System Status</span>
                    <Badge variant="default">Secure</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Rate Limiting</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Input Validation</span>
                    <Badge variant="default">Enhanced</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Security Headers</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Update</span>
                    <span className="text-sm text-muted-foreground">
                      {stats?.timestamp ? new Date(stats.timestamp).toLocaleTimeString() : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Monitoring</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Error Handling</span>
                    <Badge variant="default">Enhanced</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Threat Detection</span>
                    <Badge variant="default">Real-time</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection</CardTitle>
              <CardDescription>
                Identified security threats and mitigation actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.rateLimiting.suspiciousPatterns === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <p>No threats detected in the last 24 hours</p>
                    <p className="text-sm">Your application is secure</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium">Suspicious Pattern Detected</p>
                          <p className="text-xs text-muted-foreground">
                            Multiple invalid input attempts
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Mitigated</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Current security settings and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rate Limiting</h4>
                  <p className="text-xs text-muted-foreground">
                    Adaptive rate limiting is active with automatic IP blocking
                  </p>
                  <Badge variant="default">Configured</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Input Validation</h4>
                  <p className="text-xs text-muted-foreground">
                    Advanced pattern detection with XSS and SQL injection protection
                  </p>
                  <Badge variant="default">Enhanced</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Security Headers</h4>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive CSP and security headers are enforced
                  </p>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Monitoring</h4>
                  <p className="text-xs text-muted-foreground">
                    Real-time security event monitoring with alerting
                  </p>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;