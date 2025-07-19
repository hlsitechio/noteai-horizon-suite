
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestingService } from '@/services/testingService';
import { Play, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TestingDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(TestingService.getTestResults());
  const [healthScore, setHealthScore] = useState(TestingService.getHealthScore());

  const runTests = async () => {
    setIsRunning(true);
    try {
      await TestingService.runComponentTests();
      setTestResults(TestingService.getTestResults());
      setHealthScore(TestingService.getHealthScore());
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!TestingService.isTestingInProgress()) {
        setTestResults(TestingService.getTestResults());
        setHealthScore(TestingService.getHealthScore());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testing Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor application health and component functionality
          </p>
        </div>
        
        <Button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Application Health Score
            <Badge variant={healthScore >= 90 ? 'default' : healthScore >= 70 ? 'secondary' : 'destructive'}>
              {healthScore.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={healthScore} className="h-2" />
            <p className={`text-sm ${getHealthColor(healthScore)}`}>
              {healthScore >= 90 && 'Excellent - All systems operational'}
              {healthScore >= 70 && healthScore < 90 && 'Good - Minor issues detected'}
              {healthScore < 70 && 'Needs Attention - Critical issues found'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <AnimatePresence>
        {Array.from(testResults.entries()).map(([suiteId, suite]) => (
          <motion.div
            key={suiteId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {suite.suiteName}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {suite.passedTests}/{suite.totalTests} passed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {suite.duration.toFixed(0)}ms
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suite.tests.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <p className="font-medium">{test.testName}</p>
                          {test.error && (
                            <p className="text-sm text-red-500 mt-1">{test.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {test.duration.toFixed(0)}ms
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {testResults.size === 0 && !isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tests Run Yet</h3>
            <p className="text-muted-foreground mb-4">
              Click "Run Tests" to start component testing and health monitoring
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
