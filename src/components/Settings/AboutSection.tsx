
import React from 'react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">GitHub</span>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => window.open('https://github.com/lovableai/lovable', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              View Source
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Built with</span>
            <span className="font-medium">React + Supabase + Lovable</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">License</span>
            <span className="font-medium">MIT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
