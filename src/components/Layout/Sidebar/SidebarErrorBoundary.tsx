import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SidebarErrorBoundaryState, SidebarErrorFallbackProps } from './types';

interface SidebarErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<SidebarErrorFallbackProps>;
}

class SidebarErrorBoundary extends Component<SidebarErrorBoundaryProps, SidebarErrorBoundaryState> {
  constructor(props: SidebarErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SidebarErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sidebar Error Boundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultSidebarErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultSidebarErrorFallback: React.FC<SidebarErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => (
  <div className="p-4 space-y-4 bg-sidebar border border-destructive/20 rounded-lg">
    <div className="flex items-center space-x-2 text-destructive">
      <AlertCircle className="h-5 w-5" />
      <h3 className="font-medium">Sidebar Error</h3>
    </div>
    
    <p className="text-sm text-muted-foreground">
      Something went wrong with the sidebar component.
    </p>
    
    <details className="text-xs text-muted-foreground">
      <summary className="cursor-pointer hover:text-foreground">
        Error Details
      </summary>
      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
        {error.message}
      </pre>
    </details>
    
    <Button
      onClick={resetError}
      size="sm"
      variant="outline"
      className="w-full"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

export default SidebarErrorBoundary;