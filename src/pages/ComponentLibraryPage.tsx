import React from 'react';
import { ComponentLibrary } from '@/components/Dashboard/ComponentLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

const ComponentLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { getPanelConfiguration } = useDashboardLayout();

  // Get available panels - panels that don't have a component or are disabled
  const getAvailablePanels = () => {
    const allPanels = ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight'];
    return allPanels.filter(panelKey => {
      const config = getPanelConfiguration(panelKey);
      return !config?.enabled || !config?.component_key;
    });
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
        <ComponentLibrary availablePanels={getAvailablePanels()} />
      </div>
    </div>
  );
};

export default ComponentLibraryPage;