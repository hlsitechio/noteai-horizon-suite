import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, Check, Image, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  title?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onUpload?: (files: File[]) => void;
  onImportComplete?: () => void;
  uploadToExplorer?: boolean; // Whether to upload to document explorer
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export const FileUploadWidget: React.FC<FileUploadProps> = ({
  title = "File Upload",
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv'
  ],
  onUpload,
  onImportComplete,
  uploadToExplorer = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const uploadFileToExplorer = async (file: File): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    // Create unique file path
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 9);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomSuffix}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Save document metadata to database
    const documentData = {
      user_id: user.id,
      file_name: fileName,
      original_name: file.name,
      file_type: fileExtension?.toUpperCase() || '',
      file_size: file.size,
      mime_type: file.type,
      storage_path: filePath,
      file_url: urlData.publicUrl,
      description: null,
      tags: [],
      is_public: false
    };

    const { error: dbError } = await supabase
      .from('documents')
      .insert(documentData);

    if (dbError) throw dbError;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - uploadedFiles.length).map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const uploadFile of newFiles) {
      try {
        if (uploadToExplorer) {
          // Update progress
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadFile.file 
                ? { ...f, progress: 50 }
                : f
            )
          );

          await uploadFileToExplorer(uploadFile.file);
          
          // Mark as completed
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadFile.file 
                ? { ...f, progress: 100, status: 'completed' }
                : f
            )
          );
        } else {
          // Simulate upload progress for non-explorer uploads
          const interval = setInterval(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.file === uploadFile.file 
                  ? { ...f, progress: Math.min(f.progress + 10, 100) }
                  : f
              )
            );
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            setUploadedFiles(prev => 
              prev.map(f => 
                f.file === uploadFile.file 
                  ? { ...f, progress: 100, status: 'completed' }
                  : f
              )
            );
          }, 2000);
        }
      } catch (error: any) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === uploadFile.file 
              ? { ...f, status: 'error' }
              : f
          )
        );
        
        toast({
          title: "Upload failed",
          description: `${uploadFile.file.name}: ${error.message}`,
          variant: "destructive"
        });
      }
    }

    if (onUpload) {
      onUpload(newFiles.map(f => f.file));
    }

    if (uploadToExplorer && onImportComplete) {
      const completedCount = newFiles.filter(f => 
        uploadedFiles.some(uf => uf.file === f.file && uf.status === 'completed')
      ).length;
      
      if (completedCount > 0) {
        onImportComplete();
      }
    }
  }, [uploadedFiles.length, maxFiles, onUpload, uploadToExplorer, onImportComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxFiles - uploadedFiles.length
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
    return File;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadedFiles.length < maxFiles && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-muted/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive 
                ? 'Drop the files here...' 
                : 'Drag & drop files here, or click to select'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} files, up to {maxSize}MB each
              {uploadToExplorer && " • Files will be saved to Document Explorer"}
            </p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Files</h4>
            {uploadedFiles.map((uploadFile, index) => {
              const Icon = getFileIcon(uploadFile.file.type);
              return (
                <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-1 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'completed' && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.file)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};