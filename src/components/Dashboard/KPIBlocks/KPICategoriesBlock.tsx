
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';

interface KPICategoriesBlockProps {
  categoryCounts: Record<string, number>;
}

const KPICategoriesBlock: React.FC<KPICategoriesBlockProps> = ({
  categoryCounts,
}) => {
  const totalCategories = Object.keys(categoryCounts).length;
  const topCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

  return (
    <Card className="h-full border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:from-card/90 hover:to-card/50 transition-all duration-300">
      <CardContent className="p-4 flex items-center gap-3 h-full">
        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
          <Tag className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-foreground">{totalCategories}</div>
          <div className="text-sm text-muted-foreground truncate">Categories</div>
          {topCategory && (
            <div className="text-xs text-muted-foreground/80 mt-1">{topCategory}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICategoriesBlock;
