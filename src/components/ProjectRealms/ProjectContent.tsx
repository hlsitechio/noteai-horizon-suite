
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';

const ProjectContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Folders & Notes
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No content yet</p>
            <p>Start by adding folders and notes to organize your project knowledge.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectContent;
