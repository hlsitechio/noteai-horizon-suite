
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface KPITotalWordsBlockProps {
  totalWords: number;
}

const KPITotalWordsBlock: React.FC<KPITotalWordsBlockProps> = ({ totalWords }) => {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <FileText className="w-6 h-6 text-emerald-100" />
          <div className="text-right">
            <div className="text-2xl font-bold">{totalWords.toLocaleString()}</div>
            <div className="text-emerald-100 text-sm font-medium">Total Words</div>
          </div>
        </div>
        <div className="text-emerald-100 text-xs">
          Across all notes
        </div>
      </CardContent>
    </Card>
  );
};

export default KPITotalWordsBlock;
