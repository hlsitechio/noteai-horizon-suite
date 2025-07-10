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
    'middleLeft': 'notes-summary',
    'middleRight': 'analytics-overview',
    'bottomLeft': 'system-status',
    'bottomRight': 'task-list'
  };

  const componentKey = config?.component_key || defaultComponents[panelKey];
  const isEnabled = componentKey && (config?.enabled !== false);

  const formatPanelName = (panelKey: string) => {
    const panelNames: Record<string, string> = {
      'topLeft': 'Top Left Panel',
      'topRight': 'Top Right Panel',
      'middleLeft': 'Middle Left Panel',
      'middleRight': 'Middle Right Panel', 
      'bottomLeft': 'Bottom Left Panel',
      'bottomRight': 'Bottom Right Panel'
    };
    return panelNames[panelKey] || panelKey;
  };

  return (
    <div className={cn('relative', className)} aria-live="polite" role="region">
      {isEnabled ? (
        <div className="h-full">
          {/* Panel Header with Label */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-xs font-medium text-muted-foreground">
                {formatPanelName(panelKey)}
              </span>
            </div>
            <Settings2 className="w-3 h-3 text-muted-foreground/50" />
          </div>
          <div className="h-[calc(100%-48px)]">
            <DashboardComponentRenderer
              componentKey={componentKey}
              props={config?.props || {}}
            />
          </div>
        </div>
      ) : (
        <Card className="h-full border-dashed border-primary/30 border-2 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Settings2 className="w-4 h-4" />
              {formatPanelName(panelKey)}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                <Settings2 className="w-8 h-8 text-primary/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">No Component</p>
                <p className="text-xs text-muted-foreground">
                  Add a component from the library
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/app/components';
                }}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Browse Components
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
