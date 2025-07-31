import { useState, useEffect } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder - would fetch from API
    setIsLoading(false);
  }, []);

  const searchDocuments = (query: string) => {
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchDocuments = () => {
    // Placeholder function
  };

  const deleteDocument = (id: string) => {
    // Placeholder function
  };

  const downloadDocument = (id: string) => {
    // Placeholder function
  };

  return {
    documents,
    isLoading,
    searchDocuments,
    fetchDocuments,
    deleteDocument,
    downloadDocument
  };
};