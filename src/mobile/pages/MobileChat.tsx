
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const MobileChat: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      <DynamicMobileHeader title="Chat" />
      
      {/* Empty state */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Chat Feature Removed</h3>
              <p className="text-muted-foreground">
                The AI chat functionality has been removed from this application.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileChat;
