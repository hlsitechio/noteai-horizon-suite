import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PanelLeft, LayoutDashboard } from 'lucide-react';
import SidebarLayoutPresets from './SidebarLayoutPresets';
import DashboardLayoutPresets from './DashboardLayoutPresets';

interface LayoutPresetsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'sidebar' | 'dashboard';
}

const LayoutPresetsModal: React.FC<LayoutPresetsModalProps> = ({
  open,
  onOpenChange,
  defaultTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Layout Presets
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sidebar' | 'dashboard')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Layout
            </TabsTrigger>
            <TabsTrigger value="sidebar" className="flex items-center gap-2">
              <PanelLeft className="h-4 w-4" />
              Sidebar Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardLayoutPresets onClose={handleClose} />
          </TabsContent>

          <TabsContent value="sidebar" className="mt-6">
            <SidebarLayoutPresets onClose={handleClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LayoutPresetsModal;