
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface KPINotesBlockProps {
  totalNotes: number;
  weeklyNotes: number;
}

const KPINotesBlock: React.FC<KPINotesBlockProps> = ({
  totalNotes,
  weeklyNotes,
}) => {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-xl">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1">
          <FileText className="w-4 h-4 text-blue-100" />
          <div className="text-right">
            <div className="text-lg font-bold">{totalNotes}</div>
            <div className="text-blue-100 text-xs font-medium">Notes</div>
          </div>
        </div>
        <div className="text-blue-100 text-xs">
          +{weeklyNotes} this week
        </div>
      </CardContent>
    </Card>
  );
};

export default KPINotesBlock;
