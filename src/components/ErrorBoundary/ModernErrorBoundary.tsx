
import { Component, ErrorInfo, ReactNode } from 'react';
// Sentry removed
import { AlertTriangle, RefreshCw, Bug, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showRetry?: boolean;
  showReload?: boolean;
  level?: 'page' | 'component' | 'widget';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  retryCount: number;
}

class ModernErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const errorId = this.state.errorId || `err_${Date.now()}`;
    
    console.error('ModernErrorBoundary caught error:', error);
    console.error('Error Info:', info);
    
    // Store error info for debugging
    this.setState({ errorInfo: info });
    
    // Send to Sentry with enhanced context
    // Sentry removed - captureException call disabled

    // Track error in analytics if available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          error_boundary: 'modern',
          error_level: this.props.level || 'component',
          retry_count: this.state.retryCount,
        });
      } catch (analyticsError) {
        console.warn('Failed to track error in analytics:', analyticsError);
      }
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: this.state.retryCount + 1
      });
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportBug = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    };
    
    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    console.log('Error report copied to clipboard:', errorReport);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorLevel = this.props.level || 'component';

      return (
        <div className="flex items-center justify-center p-4 min-h-[200px]">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-red-900 dark:text-red-100 flex items-center justify-center gap-2">
                Something went wrong
                <Badge variant="outline" className="text-xs">
                  {errorLevel}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {errorLevel === 'page' 
                  ? 'This page encountered an error. Our team has been notified.'
                  : 'A component failed to load. You can try again or continue using the app.'
                }
              </p>
              
              {this.state.error && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Error Details
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-left">
                      <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all mb-2">
                        <strong>Error:</strong> {this.state.error.message}
                      </p>
                      {this.state.errorId && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>ID:</strong> {this.state.errorId}
                        </p>
                      )}
                      {this.state.retryCount > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Retry attempts:</strong> {this.state.retryCount}/{this.maxRetries}
                        </p>
                      )}
                      {this.state.errorInfo && import.meta.env.DEV && (
                        <details className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <summary className="cursor-pointer">Debug Info (Dev Mode)</summary>
                          <pre className="mt-2 overflow-auto max-h-32 text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <div className="flex gap-2 justify-center flex-wrap">
                {(this.props.showRetry !== false) && canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again ({this.maxRetries - this.state.retryCount} left)
                  </Button>
                )}
                
                {(this.props.showReload !== false) && (
                  <Button
                    onClick={this.handleReload}
                    variant="default"
                    size="sm"
                  >
                    Reload Page
                  </Button>
                )}
                
                <Button
                  onClick={this.handleReportBug}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Copy Error
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModernErrorBoundary;
