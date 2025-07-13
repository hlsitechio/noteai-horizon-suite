import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileChat: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile chat interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileChat;