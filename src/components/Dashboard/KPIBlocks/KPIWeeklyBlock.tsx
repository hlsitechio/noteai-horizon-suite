
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface KPIWeeklyBlockProps {
  weeklyNotes: number;
}

const KPIWeeklyBlock: React.FC<KPIWeeklyBlockProps> = ({ weeklyNotes }) => {
  return (
    <Card className="h-full border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <Calendar className="w-6 h-6 text-orange-100" />
          <div className="text-right">
            <div className="text-2xl font-bold">{weeklyNotes}</div>
            <div className="text-orange-100 text-sm font-medium">This Week</div>
          </div>
        </div>
        <div className="text-orange-100 text-xs">
          New notes created
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIWeeklyBlock;
