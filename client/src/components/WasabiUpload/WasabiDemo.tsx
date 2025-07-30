
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CloudUpload, Shield, Zap, Globe } from 'lucide-react';
import { WasabiFileUpload } from './WasabiFileUpload';
import { WasabiUploadResult } from '@/services/wasabiStorageService';
import { toast } from 'sonner';

export const WasabiDemo: React.FC = () => {
  const handleUploadComplete = (results: WasabiUploadResult[]) => {
    toast.success(`Successfully uploaded ${results.length} file(s) to Wasabi Cloud`);
    console.log('Upload results:', results);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <CloudUpload className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Wasabi Cloud Storage Integration</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience secure, fast, and cost-effective cloud storage with Wasabi. 
          Upload your files directly to the cloud with enterprise-grade security.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Fast
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Global CDN
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="banners" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Banner Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WasabiFileUpload
                title="Upload Banner Images"
                bucketPath="banners"
                maxFiles={3}
                onUploadComplete={handleUploadComplete}
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Image Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WasabiFileUpload
                title="Upload Images"
                bucketPath="images"
                maxFiles={5}
                onUploadComplete={handleUploadComplete}
                allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Video Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WasabiFileUpload
                title="Upload Videos"
                bucketPath="videos"
                maxFiles={2}
                onUploadComplete={handleUploadComplete}
                allowedTypes={['video/mp4', 'video/avi', 'video/mov']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WasabiFileUpload
                title="Upload Documents"
                bucketPath="documents"
                maxFiles={10}
                onUploadComplete={handleUploadComplete}
                allowedTypes={['application/pdf', 'application/msword', 'text/plain']}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Wasabi Cloud Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Shield className="h-8 w-8 mx-auto text-blue-600" />
              <h3 className="font-semibold">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">
                Bank-grade security with immutable storage and advanced encryption
              </p>
            </div>
            <div className="text-center space-y-2">
              <Zap className="h-8 w-8 mx-auto text-green-600" />
              <h3 className="font-semibold">High Performance</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast upload and download speeds with global availability
              </p>
            </div>
            <div className="text-center space-y-2">
              <Globe className="h-8 w-8 mx-auto text-purple-600" />
              <h3 className="font-semibold">Cost Effective</h3>
              <p className="text-sm text-muted-foreground">
                Up to 80% less expensive than AWS S3 with no egress fees
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
