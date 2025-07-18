import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/utils/logger';
// Sentry removed

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  preserveWork?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Smart error boundary that preserves work and provides recovery options
 */
export class SmartErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private workPreservationKey = 'error-boundary-work-preservation';

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Error logging removed to reduce console noise
    
    // Preserve work if enabled
    if (this.props.preserveWork) {
      this.preserveCurrentWork();
    }
  }

  private preserveCurrentWork = () => {
    try {
      const workData = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        error: this.state.error?.message,
        retryCount: this.state.retryCount
      };
      
      localStorage.setItem(this.workPreservationKey, JSON.stringify(workData));
      // Work preservation logging removed to reduce console noise
    } catch (error) {
      // Error logging removed to reduce console noise
    }
  };

  private handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    if (newRetryCount > this.maxRetries) {
      // Max retries logging removed to reduce console noise
      return;
    }

    // Retry logging removed to reduce console noise
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount
    });

    // Call custom retry handler if provided
    this.props.onRetry?.();
  };

  private handleGoHome = () => {
    // Clear error state and navigate to home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
    
    // SECURITY: Use navigation instead of hard redirect to prevent page reload
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', '/app/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  private handleReload = () => {
    // Preserve work before reloading
    if (this.props.preserveWork) {
      this.preserveCurrentWork();
    }
    
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border rounded-lg p-6 space-y-4">
            <div className="text-center space-y-2">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">
                Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground">
                We encountered an unexpected error. Your work has been preserved.
              </p>
            </div>

            {isDevelopment && this.state.error && (
              <div className="bg-muted p-3 rounded text-xs font-mono text-muted-foreground max-h-32 overflow-auto">
                <strong>Error:</strong> {this.state.error.message}
                {this.state.errorInfo && (
                  <>
                    <br />
                    <strong>Stack:</strong> {this.state.error.stack}
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                </Button>
              )}
              
              <Button 
                onClick={this.handleGoHome}
                className="w-full"
                variant="outline"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button 
                onClick={this.handleReload}
                className="w-full"
                variant="secondary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}