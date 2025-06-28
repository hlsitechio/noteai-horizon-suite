
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
    <Card className="h-full border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg rounded-xl">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <Tag className="w-4 h-4 text-purple-100" />
          <div className="text-right">
            <div className="text-lg font-bold">{totalCategories}</div>
            <div className="text-purple-100 text-xs font-medium">Categories</div>
          </div>
        </div>
        <div className="text-purple-100 text-xs">
          {topCategory}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICategoriesBlock;
