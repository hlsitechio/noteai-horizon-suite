
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
    <Card className="h-full border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg rounded-2xl">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Tag className="w-6 h-6 text-purple-100" />
          <div className="text-right">
            <div className="text-2xl font-bold">{totalCategories}</div>
            <div className="text-purple-100 text-sm font-medium">Categories</div>
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
