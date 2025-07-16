import React, { useState, useRef } from 'react';
import { Upload, FileText, File, X, Check, AlertCircle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  description?: string;
  tags?: string[];
}

interface DocumentImportProps {
  onImportComplete?: () => void;
  className?: string;
}

export const DocumentImport: React.FC<DocumentImportProps> = ({
  onImportComplete,
  className
}) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Supported file types
  const supportedTypes = [
    // Documents
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'text/plain', // .txt
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'text/csv',
    'application/rtf',
    'text/markdown',
    'application/json',
    'application/xml',
    'text/xml',
    // Images
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return File;
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return File;
    return File;
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  const validateFile = (file: File): string | null => {
    if (!supportedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > maxFileSize) {
      return `File size exceeds 50MB limit`;
    }
    return null;
  };

  const handleFileSelect = (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    const newFiles: FileUpload[] = [];

    fileArray.forEach(file => {
      const validation = validateFile(file);
      if (validation) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validation}`,
          variant: "destructive"
        });
        return;
      }

      const fileUpload: FileUpload = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'pending',
        description: '',
        tags: []
      };

      newFiles.push(fileUpload);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileInfo = (fileId: string, updates: Partial<FileUpload>) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, ...updates } : f
    ));
  };

  const uploadFile = async (fileUpload: FileUpload): Promise<void> => {
    const { file } = fileUpload;
    console.log('Starting upload for:', file.name);
    
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }

    // User authenticated, proceed with upload
    // Update status to uploading
    updateFileInfo(fileUpload.id, { status: 'uploading', progress: 0 });

    try {
      // Create unique file path
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 9);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${randomSuffix}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Created file path:', filePath);
      // Update progress to show upload starting
      updateFileInfo(fileUpload.id, { progress: 10 });

      // Upload to Supabase Storage
      console.log('Starting storage upload...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('Storage upload successful:', uploadData);
      // Update progress to show upload completed
      updateFileInfo(fileUpload.id, { progress: 90 });

      // Get public URL
      console.log('Getting public URL...');
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('Public URL:', urlData.publicUrl);

      // Save document metadata to database
      console.log('Saving to database...');
      const documentData = {
        user_id: user.id,
        file_name: fileName,
        original_name: file.name,
        file_type: getFileExtension(file.name),
        file_size: file.size,
        mime_type: file.type,
        storage_path: filePath,
        file_url: urlData.publicUrl,
        description: fileUpload.description || null,
        tags: fileUpload.tags || [],
        is_public: false
      };
      
      console.log('Document data to insert:', documentData);
      
      const { error: dbError } = await supabase
        .from('documents')
        .insert(documentData);

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Database save successful');
      // Update status to completed
      updateFileInfo(fileUpload.id, { 
        status: 'completed', 
        progress: 100 
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      updateFileInfo(fileUpload.id, { 
        status: 'error', 
        error: error.message || 'Upload failed' 
      });
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    try {
      // Upload files concurrently (max 3 at a time)
      const chunks = [];
      for (let i = 0; i < pendingFiles.length; i += 3) {
        chunks.push(pendingFiles.slice(i, i + 3));
      }

      for (const chunk of chunks) {
        await Promise.all(chunk.map(uploadFile));
      }

      const completedCount = files.filter(f => f.status === 'completed').length;
      const errorCount = files.filter(f => f.status === 'error').length;

      toast({
        title: "Import completed",
        description: `${completedCount} files uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        variant: completedCount > 0 ? "default" : "destructive"
      });

      if (onImportComplete && completedCount > 0) {
        onImportComplete();
      }

    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred during the import process",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const allCompleted = files.length > 0 && files.every(f => f.status === 'completed');
  const hasErrors = files.some(f => f.status === 'error');
  const pendingFiles = files.filter(f => f.status === 'pending');

  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports documents (PDF, DOCX, TXT, etc.) and images (PNG, JPG, WEBP) - max 50MB each
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={supportedTypes.join(',')}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Supported File Types */}
        <div className="flex flex-wrap gap-2">
          <Label className="text-sm font-medium">Supported formats:</Label>
          {['PDF', 'DOCX', 'TXT', 'XLSX', 'PPTX', 'CSV', 'PNG', 'JPG', 'WEBP'].map(type => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Files to Import ({files.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  onClick={uploadAllFiles}
                  disabled={isUploading || pendingFiles.length === 0}
                  size="sm"
                >
                  {isUploading ? 'Uploading...' : `Upload ${pendingFiles.length} Files`}
                </Button>
              </div>
            </div>

            <ScrollArea className="max-h-96">
              <div className="space-y-3">
                {files.map(fileUpload => {
                  const Icon = getFileIcon(fileUpload.file.type);
                  
                  return (
                    <div
                      key={fileUpload.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {fileUpload.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB • {getFileExtension(fileUpload.file.name)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {fileUpload.status === 'completed' && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                          {fileUpload.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileUpload.id)}
                            disabled={fileUpload.status === 'uploading'}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {fileUpload.status === 'uploading' && (
                        <Progress value={fileUpload.progress} className="w-full" />
                      )}

                      {/* Error Message */}
                      {fileUpload.status === 'error' && fileUpload.error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {fileUpload.error}
                        </div>
                      )}

                      {/* File Info Fields */}
                      {(fileUpload.status === 'pending' || fileUpload.status === 'error') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`desc-${fileUpload.id}`} className="text-xs">
                              Description (optional)
                            </Label>
                            <Textarea
                              id={`desc-${fileUpload.id}`}
                              placeholder="Add description..."
                              value={fileUpload.description || ''}
                              onChange={(e) => updateFileInfo(fileUpload.id, { 
                                description: e.target.value 
                              })}
                              className="h-20 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`tags-${fileUpload.id}`} className="text-xs">
                              Tags (comma-separated)
                            </Label>
                            <Input
                              id={`tags-${fileUpload.id}`}
                              placeholder="tag1, tag2, tag3"
                              value={fileUpload.tags?.join(', ') || ''}
                              onChange={(e) => updateFileInfo(fileUpload.id, { 
                                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                              })}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Status Summary */}
        {files.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <div className="flex gap-4">
              <span>Total: {files.length}</span>
              <span className="text-green-600">
                Completed: {files.filter(f => f.status === 'completed').length}
              </span>
              <span className="text-blue-600">
                Pending: {pendingFiles.length}
              </span>
              {hasErrors && (
                <span className="text-red-600">
                  Errors: {files.filter(f => f.status === 'error').length}
                </span>
              )}
            </div>
            
            {allCompleted && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                All files imported successfully
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};