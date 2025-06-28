
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface KPIFavoritesBlockProps {
  favoriteNotes: number;
  totalNotes: number;
}

const KPIFavoritesBlock: React.FC<KPIFavoritesBlockProps> = ({
  favoriteNotes,
  totalNotes,
}) => {
  const favoritePercentage = totalNotes > 0 ? Math.round((favoriteNotes / totalNotes) * 100) : 0;

  return (
    <Card className="h-full border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:from-card/90 hover:to-card/50 transition-all duration-300">
      <CardContent className="p-4 flex items-center gap-3 h-full">
        <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-foreground">{favoriteNotes}</div>
          <div className="text-sm text-muted-foreground truncate">Favorites</div>
          <div className="text-xs text-muted-foreground/80 mt-1">{favoritePercentage}%</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIFavoritesBlock;
