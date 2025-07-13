import React from 'react';
import { ComponentLibrary } from '@/components/Dashboard/ComponentLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

const ComponentLibraryPage: React.FC = () => {
  // Add error boundary for navigation hooks
  let navigate: ReturnType<typeof useNavigate>;
  let searchParams: URLSearchParams;
  
  try {
    navigate = useNavigate();
    const [searchParamsResult] = useSearchParams();
    searchParams = searchParamsResult;
  } catch (error) {
    console.error('Router context error:', error);
    // Fallback navigation
    navigate = () => {
      window.location.href = '/app/dashboard';
    };
    searchParams = new URLSearchParams(window.location.search);
  }
  const { getPanelConfiguration } = useDashboardLayout();
  
  const targetPanel = searchParams.get('targetPanel');

  // Get all panels as available - allow replacement of existing components
  const getAvailablePanels = () => {
    return ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight'];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Component Library</h1>
              <p className="text-muted-foreground">
                Browse and manage dashboard components
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <ComponentLibrary 
          availablePanels={getAvailablePanels()} 
          targetPanel={targetPanel || undefined}
        />
      </div>
    </div>
  );
};

export default ComponentLibraryPage;