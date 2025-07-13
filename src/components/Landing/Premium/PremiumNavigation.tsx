import React from 'react';

interface PremiumNavigationProps {
  mousePosition: { x: number; y: number };
}

const PremiumNavigation: React.FC<PremiumNavigationProps> = ({ mousePosition }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Premium</div>
          <div className="space-x-4">
            <a href="#features" className="text-foreground hover:text-primary">Features</a>
            <a href="#pricing" className="text-foreground hover:text-primary">Pricing</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavigation;