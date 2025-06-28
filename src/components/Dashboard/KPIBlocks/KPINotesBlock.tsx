
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
    <Card className="h-full border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-2xl">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <FileText className="w-6 h-6 text-blue-100" />
          <div className="text-right">
            <div className="text-2xl font-bold">{totalNotes}</div>
            <div className="text-blue-100 text-sm font-medium">Notes</div>
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
