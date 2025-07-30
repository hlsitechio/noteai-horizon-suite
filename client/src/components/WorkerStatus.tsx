/**
 * Worker Status Component
 * Displays real-time worker thread and performance information
 */

import React from 'react';
import { Activity, Cpu, MemoryStick, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface WorkerStatusProps {
  showDetails?: boolean;
  className?: string;
}

const WorkerStatus: React.FC<WorkerStatusProps> = ({ showDetails = false, className = '' }) => {
  const { metrics, isMonitoring } = usePerformanceMonitor();

  if (!isMonitoring) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Performance monitoring disabled</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'bg-green-500';
    if (value < thresholds[1]) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (isHighCPU: boolean) => {
    if (isHighCPU) {
      return <Badge variant="destructive">High Load</Badge>;
    }
    return <Badge variant="outline" className="text-green-600 border-green-600">Optimal</Badge>;
  };

  if (!showDetails) {
    // Compact view
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          <span className="text-xs">{metrics.cpuUsage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <MemoryStick className="w-3 h-3" />
          <span className="text-xs">{metrics.memoryUsage}%</span>
        </div>
        {getStatusBadge(metrics.isHighCPU)}
      </div>
    );
  }

  // Detailed view
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4" />
          Worker Performance
          {getStatusBadge(metrics.isHighCPU)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU Usage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              CPU Usage
            </span>
            <span>{metrics.cpuUsage}%</span>
          </div>
          <Progress 
            value={metrics.cpuUsage} 
            className="h-2"
          />
        </div>

        {/* Memory Usage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Memory Usage
            </span>
            <span>{metrics.memoryUsage}%</span>
          </div>
          <Progress 
            value={metrics.memoryUsage} 
            className="h-2"
          />
        </div>

        {/* Worker Statistics */}
        {metrics.workerStats && (
          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-xs font-medium">Worker Threads</h4>
            
            {metrics.workerStats.ai && (
              <div className="flex justify-between text-xs">
                <span>AI Workers:</span>
                <span>
                  {metrics.workerStats.ai.threads} threads, 
                  {metrics.workerStats.ai.queueSize} queued
                </span>
              </div>
            )}
            
            {metrics.workerStats.ocr && (
              <div className="flex justify-between text-xs">
                <span>OCR Workers:</span>
                <span>
                  {metrics.workerStats.ocr.threads} threads, 
                  {metrics.workerStats.ocr.queueSize} queued
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {metrics.recommendations.length > 0 && (
          <div className="space-y-1 pt-2 border-t">
            <h4 className="text-xs font-medium text-yellow-600">Recommendations:</h4>
            {metrics.recommendations.map((rec, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                • {rec}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerStatus;