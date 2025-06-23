
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCustomCursor } from '../../hooks/useCustomCursor';
import { MousePointer, Palette, Minimize2, Power } from 'lucide-react';

const CursorPackSelector: React.FC = () => {
  const { currentPack, switchPack, availablePacks, isActive, setIsActive } = useCustomCursor();

  const getPackIcon = (packId: string) => {
    switch (packId) {
      case 'neon': return <Palette className="w-4 h-4" />;
      case 'minimal': return <Minimize2 className="w-4 h-4" />;
      default: return <MousePointer className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MousePointer className="w-5 h-5" />
          Cursor Packs
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2"
          >
            <Power className="w-3 h-3" />
            {isActive ? 'Enabled' : 'Disabled'}
          </Button>
          {isActive && (
            <Badge variant="secondary" className="text-xs">
              Active: {availablePacks.find(p => p.id === currentPack)?.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {availablePacks.map((pack) => (
          <div
            key={pack.id}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              currentPack === pack.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                : 'border-border hover:border-blue-300'
            }`}
            onClick={() => switchPack(pack.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPackIcon(pack.id)}
                <div>
                  <h4 className="font-medium text-sm">{pack.name}</h4>
                  <p className="text-xs text-muted-foreground">{pack.description}</p>
                </div>
              </div>
              {currentPack === pack.id && (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CursorPackSelector;
