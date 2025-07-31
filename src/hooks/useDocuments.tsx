import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  original_name: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  file_url: string;
  description?: string;
  tags: string[];
  is_public: boolean;
  folder_id?: string | null;
  created_at: string;
  updated_at: string;
  updatedAt?: string; // For compatibility
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message);
      toast({
        title: "Error loading documents",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      // Get document info first
      const document = documents.find(d => d.id === documentId);
      if (!document) throw new Error('Document not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storage_path]);

      if (storageError) {
        console.warn('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== documentId));

      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted"
      });
    } catch (err: any) {
      console.error('Error deleting document:', err);
      toast({
        title: "Error deleting document",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId);

      if (error) throw error;

      // Update local state
      setDocuments(prev => prev.map(d => 
        d.id === documentId ? { ...d, ...updates } : d
      ));

      toast({
        title: "Document updated",
        description: "Document has been successfully updated"
      });
    } catch (err: any) {
      console.error('Error updating document:', err);
      toast({
        title: "Error updating document",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      // Create download link
      const link = window.document.createElement('a');
      link.href = document.file_url;
      link.download = document.original_name;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${document.original_name}`
      });
    } catch (err: any) {
      console.error('Error downloading document:', err);
      toast({
        title: "Error downloading document",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Filter documents by various criteria
  const filterDocuments = (criteria: {
    searchTerm?: string;
    fileType?: string;
    tags?: string[];
    folderId?: string;
  }) => {
    return documents.filter(doc => {
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        if (!doc.original_name.toLowerCase().includes(searchLower) &&
            !doc.description?.toLowerCase().includes(searchLower) &&
            !doc.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      if (criteria.fileType && doc.file_type !== criteria.fileType) {
        return false;
      }

      if (criteria.tags?.length && 
          !criteria.tags.some(tag => doc.tags.includes(tag))) {
        return false;
      }

      if (criteria.folderId !== undefined) {
        if (criteria.folderId === null && doc.folder_id !== null) {
          return false;
        }
        if (criteria.folderId !== null && doc.folder_id !== criteria.folderId) {
          return false;
        }
      }

      return true;
    });
  };

  // Get unique file types for filtering
  const getFileTypes = () => {
    const types = [...new Set(documents.map(d => d.file_type))];
    return types.sort();
  };

  // Get unique tags for filtering
  const getTags = () => {
    const allTags = documents.flatMap(d => d.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    deleteDocument,
    updateDocument,
    downloadDocument,
    filterDocuments,
    getFileTypes,
    getTags,
  };
};