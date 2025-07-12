import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';
import { useEnhancedSecurityMonitoring } from '@/hooks/useEnhancedSecurityMonitoring';
import { complianceMonitoringService } from '@/services/security/complianceMonitoring';

export const EnhancedSecurityDashboard: React.FC = () => {
  const { getSecurityMetrics } = useEnhancedSecurityMonitoring();
  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    threatCount: 0,
    dataBreachAttempts: 0,
    sessionAnomalies: 0,
    complianceViolations: 0,
    securityScore: 85
  });

  useEffect(() => {
    const loadData = async () => {
      const currentMetrics = getSecurityMetrics();
      setMetrics(currentMetrics);
      
      const report = await complianceMonitoringService.runComplianceAudit();
      setComplianceReport(report);
    };
    
    loadData();
  }, [getSecurityMetrics]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.securityScore)}`}>
              {metrics.securityScore}/100
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.threatCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Anomalies</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionAnomalies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceReport?.overallScore || 0}/100
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Threats Blocked:</span>
                        <Badge variant="destructive">{metrics.threatCount}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Security Events:</span>
                        <Badge variant="secondary">{metrics.sessionAnomalies}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compliance Status</h4>
                    <div className="space-y-2">
                      {complianceReport && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Checks Passed:</span>
                            <Badge variant="default">{complianceReport.passedChecks}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Failed Checks:</span>
                            <Badge variant="destructive">{complianceReport.failedChecks}</Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Threat Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Active Protection</h4>
                    <ul className="text-sm space-y-1">
                      <li>• SQL Injection Detection</li>
                      <li>• XSS Attack Prevention</li>
                      <li>• Path Traversal Protection</li>
                      <li>• Suspicious User Agent Monitoring</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">AI-Powered Analysis</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Real-time payload analysis</li>
                      <li>• Behavioral anomaly detection</li>
                      <li>• Session security validation</li>
                      <li>• Content Security Policy enforcement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              {complianceReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(complianceReport.frameworkScores).map(([framework, score]) => (
                      <div key={framework} className="text-center">
                        <div className="text-lg font-semibold">{framework}</div>
                        <div className={`text-2xl font-bold ${getScoreColor(score as number)}`}>
                          {score}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};