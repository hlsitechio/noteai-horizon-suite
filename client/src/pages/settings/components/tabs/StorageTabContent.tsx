import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageIndicator } from '@/components/Storage/StorageIndicator';
import { HardDrive } from 'lucide-react';

export const StorageTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor your cloud storage usage and manage your storage quota. 
            Your files are securely stored in your private Wasabi cloud bucket.
          </p>
        </div>

        <StorageIndicator variant="full" showUpgrade={true} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Features</CardTitle>
          <CardDescription>
            Your storage includes all uploaded documents, images, and files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Included Storage:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Document files (.pdf, .doc, .txt)</li>
                <li>• Images (.jpg, .png, .gif)</li>
                <li>• Uploaded attachments</li>
                <li>• Banner images</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Storage Benefits:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Private & secure cloud storage</li>
                <li>• Automatic backups</li>
                <li>• Fast global access</li>
                <li>• Redundant data protection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};