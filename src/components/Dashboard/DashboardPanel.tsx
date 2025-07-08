import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DashboardComponentRenderer } from './ComponentRegistry';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardPanelProps {
  panelKey: string;
  className?: string;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  panelKey,
  className = 'p-6 h-full'
}) => {
  const { getPanelConfiguration } = useDashboardLayout();
  const config = getPanelConfiguration(panelKey);

  // Default components for each panel if not configured
  const defaultComponents: Record<string, string> = {
    'topLeft': 'quick-actions',
    'topRight': 'recent-activity', 
    'bottomLeft': 'notes-summary',
    'bottomRight': 'analytics-overview'
  };

  const componentKey = config?.component_key || defaultComponents[panelKey];
  const isEnabled = componentKey && (config?.enabled !== false);

  return (
    <div className={cn('relative', className)} aria-live="polite" role="region">
      {isEnabled ? (
        <DashboardComponentRenderer
          componentKey={componentKey}
          props={config?.props || {}}
        />
      ) : (
        <Card className="h-full border-dashed border-muted border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Settings2 className="w-4 h-4" />
              Empty Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4">
              <p>This panel is not configured yet.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Redirect to a settings page, or open modal
                  // e.g. navigate('/app/settings/layout')
                }}
              >
                Go to Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
