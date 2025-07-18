import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConsoleCapture } from '@/hooks/useConsoleCapture';
import { AlertTriangle, Bug, Info, Zap } from 'lucide-react';

export const ConsoleDebugViewer = () => {
  const { messages, stats, getErrorsAndWarnings, exportAllMessages, clearAllMessages } = useConsoleCapture();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warn': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Console Debug Viewer</h2>
        <div className="flex gap-2">
          <Button onClick={exportAllMessages} variant="outline">
            Export Messages
          </Button>
          <Button onClick={clearAllMessages} variant="outline">
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
            <div className="text-sm text-muted-foreground">Info</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.logs}</div>
            <div className="text-sm text-muted-foreground">Logs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.debug}</div>
            <div className="text-sm text-muted-foreground">Debug</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.trace}</div>
            <div className="text-sm text-muted-foreground">Trace</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Console Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No console messages captured yet
                </div>
              ) : (
                messages.slice(-50).map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${getLevelColor(message.level)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getLevelIcon(message.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {message.level.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm font-mono break-all">
                          {message.message}
                        </div>
                        {message.source && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {message.source.file}:{message.source.line}:{message.source.column}
                          </div>
                        )}
                        {message.stack && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer text-muted-foreground">
                              Stack trace
                            </summary>
                            <pre className="text-xs mt-1 whitespace-pre-wrap break-all">
                              {message.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Test Console Capture */}
      <Card>
        <CardHeader>
          <CardTitle>Test Console Capture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => console.log('Test log message')} 
              variant="outline"
            >
              Test Log
            </Button>
            <Button 
              onClick={() => console.warn('Test warning message')} 
              variant="outline"
            >
              Test Warning
            </Button>
            <Button 
              onClick={() => console.error('Test error message')} 
              variant="outline"
            >
              Test Error
            </Button>
            <Button 
              onClick={() => console.info('Test info message')} 
              variant="outline"
            >
              Test Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};