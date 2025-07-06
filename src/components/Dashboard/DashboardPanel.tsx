import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardComponentRenderer } from './ComponentRegistry';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

interface DashboardPanelProps {
  panelKey: string;
  className?: string;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  panelKey, 
  className = "p-6 h-full" 
}) => {
  const { getPanelConfiguration } = useDashboardLayout();
  const config = getPanelConfiguration(panelKey);

  return (
    <div className={className}>
      {config?.enabled ? (
        <DashboardComponentRenderer 
          componentKey={config.component_key}
          props={config.props}
        />
      ) : (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Empty Panel</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Configure this panel in settings</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};