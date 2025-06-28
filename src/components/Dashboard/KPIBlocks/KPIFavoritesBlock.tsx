
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
    <Card className="h-full border-0 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg rounded-xl">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <Heart className="w-4 h-4 text-pink-100" />
          <div className="text-right">
            <div className="text-lg font-bold">{favoriteNotes}</div>
            <div className="text-pink-100 text-xs font-medium">Favorites</div>
          </div>
        </div>
        <div className="text-pink-100 text-xs">
          {favoritePercentage}%
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIFavoritesBlock;
