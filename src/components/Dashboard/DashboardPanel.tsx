import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DashboardComponentRenderer } from './ComponentRegistry';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { cn } from '@/lib/utils';
import { Settings2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardPanelProps {
  panelKey: string;
  className?: string;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  panelKey,
  className = 'p-3 h-full' // Reduced default padding from p-6 to p-3
}) => {
  const navigate = useNavigate();
  const { getPanelConfiguration, updatePanelConfiguration } = useDashboardLayout();
  const config = getPanelConfiguration(panelKey);

  // Only use configured components, no default fallbacks
  const componentKey = config?.component_key;
  const isEnabled = componentKey && config?.enabled === true;

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

  const handleRemoveComponent = async () => {
    await updatePanelConfiguration(panelKey, '', false);
  };

  return (
    <div className={cn('relative group', className)} aria-live="polite" role="region">
      {isEnabled ? (
        <div className="h-full relative">
          {/* Panel Header with Label and Action Buttons */}
          <div className="flex items-center justify-between p-2 border-b bg-muted/5"> {/* Reduced padding from p-3 to p-2 */}
            <div className="flex items-center gap-1.5"> {/* Reduced gap from gap-2 to gap-1.5 */}
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {/* Reduced size from w-2 h-2 to w-1.5 h-1.5 */}
              <span className="text-xs font-medium text-muted-foreground">
                {formatPanelName(panelKey)}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate(`/app/components?targetPanel=${panelKey}`);
                    }}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Change
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Browse and select a different component</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveComponent}
                    className="text-xs px-2 py-1 h-auto text-destructive hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Remove component from this panel</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="h-[calc(100%-40px)]"> {/* Adjusted for smaller header */}
            <DashboardComponentRenderer
              componentKey={componentKey}
              props={config?.props || {}}
            />
          </div>
        </div>
      ) : (
        <Card className="h-full border-dashed border-primary/30 border-2 bg-primary/5 hover:bg-primary/10 transition-colors">
          <CardHeader className="pb-2"> {/* Reduced padding from pb-3 to pb-2 */}
            <CardTitle className="flex items-center gap-1.5 text-primary text-sm"> {/* Reduced gap and font size */}
              <Settings2 className="w-3 h-3" /> {/* Reduced icon size from w-4 h-4 to w-3 h-3 */}
              {formatPanelName(panelKey)}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center gap-3"> {/* Reduced gap from gap-4 to gap-3 */}
              <div className="w-12 h-12 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center"> {/* Reduced size from w-16 h-16 to w-12 h-12 */}
                <Settings2 className="w-6 h-6 text-primary/50" /> {/* Reduced icon size from w-8 h-8 to w-6 h-6 */}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">No Component</p>
                <p className="text-xs text-muted-foreground">
                  Add a component from the library
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate(`/app/components?targetPanel=${panelKey}`);
                    }}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    Browse Components
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Add a component to this panel from the component library</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
