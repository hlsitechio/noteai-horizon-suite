
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface KPIAvgWordsBlockProps {
  avgWordsPerNote: number;
  totalWords: number;
}

const KPIAvgWordsBlock: React.FC<KPIAvgWordsBlockProps> = ({
  avgWordsPerNote,
  totalWords,
}) => {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg rounded-xl">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <TrendingUp className="w-4 h-4 text-green-100" />
          <div className="text-right">
            <div className="text-lg font-bold">{avgWordsPerNote}</div>
            <div className="text-green-100 text-xs font-medium">Avg Words</div>
          </div>
        </div>
        <div className="text-green-100 text-xs">
          {totalWords} total
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIAvgWordsBlock;
