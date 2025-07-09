import React, { useState } from 'react';
import { LayoutDashboard, PanelLeft } from 'lucide-react';
import LayoutPresetsModal from './LayoutPresetsModal';

interface LayoutEditToggleProps {
  type: 'dashboard' | 'sidebar';
  onEditModeEnabled?: () => void;
}

const LayoutEditToggle: React.FC<LayoutEditToggleProps> = ({ type, onEditModeEnabled }) => {
  const [showPresetsModal, setShowPresetsModal] = useState(false);

  const handleClick = () => {
    setShowPresetsModal(true);
  };

  const handleModalClose = () => {
    setShowPresetsModal(false);
    if (onEditModeEnabled) {
      onEditModeEnabled();
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer group">
        <div className={`p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform ${
          type === 'dashboard' 
            ? 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20' 
            : 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20'
        }`}>
          {type === 'dashboard' ? (
            <LayoutDashboard className="w-8 h-8" />
          ) : (
            <PanelLeft className="w-8 h-8" />
          )}
        </div>
        <h4 className="font-semibold mb-2">
          {type === 'dashboard' ? 'Dashboard' : 'Sidebar'} Layout Presets
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          Choose from predefined {type} layout configurations
        </p>
        <div className="flex items-center justify-center gap-2 text-xs">
          {type === 'dashboard' ? (
            <LayoutDashboard className="w-3 h-3" />
          ) : (
            <PanelLeft className="w-3 h-3" />
          )}
          <span className="text-muted-foreground">Click to Configure</span>
        </div>
      </div>

      {/* Layout Presets Modal */}
      <LayoutPresetsModal
        open={showPresetsModal}
        onOpenChange={setShowPresetsModal}
        defaultTab={type}
      />
    </>
  );
};

export default LayoutEditToggle;