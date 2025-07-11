import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TechnicalSEOService, TechnicalSEOIssue, CoreWebVitals, PageSpeedMetrics } from '@/services/technicalSEOService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Smartphone, 
  Shield, 
  Zap,
  TrendingUp,
  Eye,
  Link,
  Image,
  FileText
} from 'lucide-react';

const TechnicalSEODashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchSEOReport();
    }
  }, [user]);

  const fetchSEOReport = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const reportData = await TechnicalSEOService.generateComprehensiveReport(
        user.id, 
        window.location.hostname
      );
      setReport(reportData);
    } catch (error) {
      console.error('Error fetching SEO report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'missing_h1':
        return <FileText className="h-4 w-4" />;
      case 'broken_link':
        return <Link className="h-4 w-4" />;
      case 'large_image':
      case 'missing_alt':
        return <Image className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load SEO report. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technical SEO Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive technical SEO audit and recommendations
          </p>
        </div>
        <Button onClick={fetchSEOReport} disabled={isLoading}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Overall SEO Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(report.overall_score)}>
                {report.overall_score}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
            <Progress value={report.overall_score} className="flex-1" />
            <Badge variant={getScoreBadgeVariant(report.overall_score)}>
              {report.overall_score >= 80 ? 'Excellent' : 
               report.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="page-speed">Page Speed</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Core Web Vitals Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>LCP</span>
                    <span className={report.core_web_vitals.lcp <= 2.5 ? 'text-green-600' : 'text-red-600'}>
                      {report.core_web_vitals.lcp}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>FID</span>
                    <span className={report.core_web_vitals.fid <= 100 ? 'text-green-600' : 'text-red-600'}>
                      {report.core_web_vitals.fid}ms
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CLS</span>
                    <span className={report.core_web_vitals.cls <= 0.1 ? 'text-green-600' : 'text-red-600'}>
                      {report.core_web_vitals.cls}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Page Speed Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Page Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Desktop</span>
                    <span className={getScoreColor(report.page_speed.desktop_score)}>
                      {report.page_speed.desktop_score}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mobile</span>
                    <span className={getScoreColor(report.page_speed.mobile_score)}>
                      {report.page_speed.mobile_score}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Friendly */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile Friendly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {report.mobile_friendly.is_mobile_friendly ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">
                    {report.mobile_friendly.is_mobile_friendly ? 'Pass' : 'Fail'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.mobile_friendly.issues.length} issues found
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>HTTPS</span>
                    <span className={report.security.https_enabled ? 'text-green-600' : 'text-red-600'}>
                      {report.security.https_enabled ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SSL Grade</span>
                    <span className="text-green-600">{report.security.ssl_grade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="core-vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals Analysis</CardTitle>
              <CardDescription>
                Performance metrics that impact user experience and SEO rankings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* LCP */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Largest Contentful Paint (LCP)</h4>
                  <span className={report.core_web_vitals.lcp <= 2.5 ? 'text-green-600' : 'text-red-600'}>
                    {report.core_web_vitals.lcp}s
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (2.5 / report.core_web_vitals.lcp) * 100)} 
                  className="mb-1"
                />
                <p className="text-sm text-muted-foreground">
                  Target: &lt; 2.5s | {report.core_web_vitals.lcp <= 2.5 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>

              {/* FID */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">First Input Delay (FID)</h4>
                  <span className={report.core_web_vitals.fid <= 100 ? 'text-green-600' : 'text-red-600'}>
                    {report.core_web_vitals.fid}ms
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (100 / report.core_web_vitals.fid) * 100)} 
                  className="mb-1"
                />
                <p className="text-sm text-muted-foreground">
                  Target: &lt; 100ms | {report.core_web_vitals.fid <= 100 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>

              {/* CLS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Cumulative Layout Shift (CLS)</h4>
                  <span className={report.core_web_vitals.cls <= 0.1 ? 'text-green-600' : 'text-red-600'}>
                    {report.core_web_vitals.cls}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (0.1 / report.core_web_vitals.cls) * 100)} 
                  className="mb-1"
                />
                <p className="text-sm text-muted-foreground">
                  Target: &lt; 0.1 | {report.core_web_vitals.cls <= 0.1 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-speed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Desktop Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(report.page_speed.desktop_score)}`}>
                    {report.page_speed.desktop_score}
                  </div>
                  <p className="text-sm text-muted-foreground">Speed Score</p>
                </div>
                <Progress value={report.page_speed.desktop_score} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(report.page_speed.mobile_score)}`}>
                    {report.page_speed.mobile_score}
                  </div>
                  <p className="text-sm text-muted-foreground">Speed Score</p>
                </div>
                <Progress value={report.page_speed.mobile_score} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Optimization Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {report.mobile_friendly.is_mobile_friendly ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      Mobile-Friendly Test: {report.mobile_friendly.is_mobile_friendly ? 'Pass' : 'Fail'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {report.mobile_friendly.issues.length} issues detected
                    </p>
                  </div>
                </div>

                {report.mobile_friendly.issues.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Issues Found:</h5>
                    <ul className="space-y-1">
                      {report.mobile_friendly.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h5 className="font-medium mb-2">Recommendations:</h5>
                  <ul className="space-y-1">
                    {report.mobile_friendly.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Issues</CardTitle>
              <CardDescription>
                {report.technical_issues.length} issues found that may affect SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.technical_issues.map((issue: TechnicalSEOIssue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(issue.severity)}
                        {getIssueIcon(issue.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{issue.description}</h4>
                          <Badge variant={
                            issue.severity === 'critical' ? 'destructive' : 
                            issue.severity === 'warning' ? 'secondary' : 'default'
                          }>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Page: {issue.page_path}
                          {issue.element && ` | Element: ${issue.element}`}
                        </p>
                        <p className="text-sm mt-2">{issue.fix_suggestion}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Fix Issue
                        </Button>
                      </div>
                    </div>
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

export default TechnicalSEODashboard;