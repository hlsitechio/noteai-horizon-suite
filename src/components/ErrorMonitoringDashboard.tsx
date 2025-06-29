
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, TrendingUp, Globe, Wifi } from 'lucide-react';
import { consoleErrorManager } from '@/utils/consoleErrorSuppression';
import { networkErrorRecoveryManager } from '@/utils/networkErrorRecovery';
import { resourceLoadingErrorManager } from '@/utils/resourceLoadingErrorHandler';
import { errorThrottlingManager } from '@/utils/errorThrottlingDeduplication';
import { chromeExtensionConflictManager } from '@/utils/chromeExtensionConflictHandler';
import { browserCompatibilityManager } from '@/utils/browserCompatibilityHandler';

const ErrorMonitoringDashboard: React.FC = () => {
  const [consoleStats, setConsoleStats] = useState<any>({});
  const [networkStatus, setNetworkStatus] = useState<any>({});
  const [resourceStats, setResourceStats] = useState<any>({});
  const [errorStats, setErrorStats] = useState<any>({});
  const [extensionStats, setExtensionStats] = useState<any>({});
  const [browserInfo, setBrowserInfo] = useState<any>({});

  const refreshStats = () => {
    setConsoleStats(consoleErrorManager.getStats());
    setNetworkStatus(networkErrorRecoveryManager.getNetworkStatus());
    setResourceStats(resourceLoadingErrorManager.getStats());
    setErrorStats(errorThrottlingManager.getErrorStats());
    setExtensionStats(chromeExtensionConflictManager.getStats());
    setBrowserInfo(browserCompatibilityManager.getBrowserInfo());
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAllErrors = () => {
    consoleErrorManager.clearLog();
    networkErrorRecoveryManager.clearFailedRequests();
    resourceLoadingErrorManager.clearFailedResources();
    errorThrottlingManager.clearAllErrors();
    refreshStats();
  };

  const getStatusColor = (isGood: boolean) => isGood ? 'bg-green-500' : 'bg-red-500';
  const getStatusIcon = (isGood: boolean) => isGood ? CheckCircle : AlertTriangle;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Error Monitoring Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={refreshStats} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleClearAllErrors} variant="destructive" size="sm">
            Clear All Errors
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Console Errors</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(consoleStats.total === 0)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consoleStats.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {consoleStats.suppressed || 0} suppressed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Wifi className={`w-4 h-4 ${networkStatus.isOnline ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkStatus.isOnline ? 'Online' : 'Offline'}
            </div>
            <p className="text-xs text-muted-foreground">
              {networkStatus.failedRequestsCount || 0} failed requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Loading</CardTitle>
            <Globe className={`w-4 h-4 ${resourceStats.total === 0 ? 'text-green-500' : 'text-yellow-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceStats.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Failed resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Browser Support</CardTitle>
            <CheckCircle className={`w-4 h-4 ${browserInfo.isSupported ? 'text-green-500' : 'text-yellow-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{browserInfo.name}</div>
            <p className="text-xs text-muted-foreground">
              Version {browserInfo.version}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="console">Console</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="throttling">Throttling</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Console Error Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {consoleStats.byLevel && Object.entries(consoleStats.byLevel).map(([level, count]) => (
                  <div key={level} className="text-center">
                    <div className="text-2xl font-bold">{count as number}</div>
                    <Badge variant={level === 'error' ? 'destructive' : 'secondary'}>
                      {level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Error Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <Badge variant={networkStatus.isOnline ? 'default' : 'destructive'}>
                    {networkStatus.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Failed Requests</span>
                  <span className="font-bold">{networkStatus.failedRequestsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Queued Requests</span>
                  <span className="font-bold">{networkStatus.queuedRequestsCount || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Loading Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceStats.byType && Object.entries(resourceStats.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type} Failures</span>
                    <Badge variant={count === 0 ? 'default' : 'destructive'}>
                      {count as number}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="throttling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Throttling Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Unique Errors</span>
                  <span className="font-bold">{errorStats.totalUniqueErrors || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Occurrences</span>
                  <span className="font-bold">{errorStats.totalOccurrences || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Suppressed Errors</span>
                  <Badge variant="secondary">{errorStats.suppressedErrors || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Extension Conflicts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Conflicts</span>
                  <span className="font-bold">{extensionStats.totalConflicts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Resolved Conflicts</span>
                  <Badge variant="default">{extensionStats.resolvedConflicts || 0}</Badge>
                </div>
                {extensionStats.conflictsByType && Object.entries(extensionStats.conflictsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <span className="font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorMonitoringDashboard;
