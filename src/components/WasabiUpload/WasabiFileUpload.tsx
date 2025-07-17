
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, CloudUpload, File, X, Check, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { WasabiStorageService, WasabiUploadResult } from '@/services/wasabiStorageService';
import { toast } from 'sonner';

interface WasabiFileUploadProps {
  title?: string;
  bucketPath?: string;
  maxFiles?: number;
  onUploadComplete?: (results: WasabiUploadResult[]) => void;
  allowedTypes?: string[];
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  result?: WasabiUploadResult;
}

export const WasabiFileUpload: React.FC<WasabiFileUploadProps> = ({
  title = "Wasabi Cloud Upload",
  bucketPath = 'uploads',
  maxFiles = 5,
  onUploadComplete,
  allowedTypes
}) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.slice(0, maxFiles - uploads.length).map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploads(prev => [...prev, ...newUploads]);
    setIsUploading(true);

    const results: WasabiUploadResult[] = [];

    try {
      for (const uploadProgress of newUploads) {
        try {
          const result = await WasabiStorageService.uploadFile(
            uploadProgress.file,
            bucketPath,
            (progress) => {
              setUploads(prev => 
                prev.map(upload => 
                  upload.file === uploadProgress.file 
                    ? { ...upload, progress }
                    : upload
                )
              );
            }
          );

          if (result.success) {
            setUploads(prev => 
              prev.map(upload => 
                upload.file === uploadProgress.file 
                  ? { ...upload, status: 'completed', result }
                  : upload
              )
            );
            
            results.push(result);
            toast.success(`${uploadProgress.file.name} uploaded successfully`);
          } else {
            setUploads(prev => 
              prev.map(upload => 
                upload.file === uploadProgress.file 
                  ? { ...upload, status: 'error', result }
                  : upload
              )
            );
            
            toast.error(`Failed to upload ${uploadProgress.file.name}: ${result.error}`);
          }
        } catch (error) {
          setUploads(prev => 
            prev.map(upload => 
              upload.file === uploadProgress.file 
                ? { ...upload, status: 'error' }
                : upload
            )
          );
          
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          toast.error(`Failed to upload ${uploadProgress.file.name}: ${errorMessage}`);
        }
      }

      if (onUploadComplete && results.length > 0) {
        onUploadComplete(results);
      }
    } finally {
      setIsUploading(false);
    }
  }, [uploads.length, maxFiles, bucketPath, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes ? allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}) : undefined,
    maxFiles: maxFiles - uploads.length,
    disabled: isUploading
  });

  const removeUpload = (fileToRemove: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== fileToRemove));
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== 'completed'));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CloudUpload className="h-4 w-4" />
          {title}
          <Badge variant="outline" className="ml-auto">
            Wasabi Cloud
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploads.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <CloudUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive 
                ? 'Drop the files here...' 
                : 'Drag & drop files here, or click to select'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} files • Files will be stored in Wasabi Cloud
            </p>
            <p className="text-xs text-muted-foreground">
              Path: /{bucketPath}
            </p>
          </div>
        )}

        {uploads.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Upload Progress</h4>
              {uploads.some(u => u.status === 'completed') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompleted}
                  className="text-xs"
                >
                  Clear Completed
                </Button>
              )}
            </div>
            
            {uploads.map((upload, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm truncate">{upload.file.name}</p>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(upload.status)}
                    >
                      {upload.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {WasabiStorageService.formatFileSize(upload.file.size)}
                  </p>
                  {upload.status === 'uploading' && (
                    <Progress value={upload.progress} className="h-1 mt-1" />
                  )}
                  {upload.status === 'completed' && upload.result?.url && (
                    <p className="text-xs text-green-600 mt-1 truncate">
                      Uploaded to: {upload.result.url}
                    </p>
                  )}
                  {upload.status === 'error' && upload.result?.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {upload.result.error}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(upload.status)}
                  {upload.status !== 'uploading' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.file)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
