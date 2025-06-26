
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md">
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-4">
                The application encountered an error and couldn't render properly.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 mb-4"
              >
                Reload Page
              </button>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                    Error Details
                  </summary>
                  <div className="text-xs text-destructive bg-destructive/10 p-3 rounded overflow-auto">
                    <p className="font-semibold mb-2">Error: {this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
