import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';
import { DocumentAnalysisResult } from '@/components/Document/SmartDocumentAnalyzer';

export const useDocumentAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  // Extract text from various file formats
  const extractText = useCallback(async (file: File): Promise<string | null> => {
    try {
      console.log('Extracting text from file:', file.name, file.type);
      
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        // Handle text files directly
        return await file.text();
      }
      
      // For other formats, convert to base64 and send to extraction service
      const reader = new FileReader();
      const base64File = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('document-text-extraction', {
        body: {
          file: base64File,
          filename: file.name,
          mimeType: file.type
        }
      });

      if (error) throw error;
      return data.text || null;

    } catch (error: any) {
      console.error('Error extracting text:', error);
      toast.error(`Failed to extract text from ${file.name}: ${error.message}`);
      return null;
    }
  }, [toast]);

  // Analyze document content
  const analyzeDocument = useCallback(async (file: File): Promise<DocumentAnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      console.log('Starting document analysis for:', file.name);
      
      // Step 1: Extract text (20% progress)
      setAnalysisProgress(20);
      const text = await extractText(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in document');
      }

      // Step 2: Send for AI analysis (80% progress)
      setAnalysisProgress(40);
      
      const { data, error } = await supabase.functions.invoke('advanced-document-analysis', {
        body: {
          text,
          filename: file.name,
          options: {
            analyze_sentiment: true,
            extract_entities: true,
            generate_summary: true,
            extract_keywords: true,
            analyze_structure: true,
            calculate_readability: true,
            provide_suggestions: true
          }
        }
      });

      if (error) throw error;

      setAnalysisProgress(80);

      // Step 3: Format results
      const result: DocumentAnalysisResult = {
        summary: data.summary || 'No summary available',
        keyPoints: data.key_points || [],
        sentiment: data.sentiment || 'neutral',
        topics: data.topics || [],
        entities: data.entities || [],
        language: data.language || 'en',
        readability: {
          score: data.readability?.score || 50,
          level: data.readability?.level || 'Moderate',
          readingTime: data.readability?.reading_time || 0
        },
        structure: {
          headings: data.structure?.headings || [],
          paragraphs: data.structure?.paragraphs || 0,
          sentences: data.structure?.sentences || 0,
          words: data.structure?.words || 0
        },
        suggestions: data.suggestions || []
      };

      setAnalysisProgress(100);
      console.log('Document analysis complete:', result);
      
      return result;

    } catch (error: any) {
      console.error('Error analyzing document:', error);
      toast.error(`Failed to analyze document: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  }, [extractText, toast]);

  // Generate enhanced summary
  const generateSummary = useCallback(async (
    text: string, 
    summaryType: 'brief' | 'detailed' | 'bullet-points' = 'brief'
  ): Promise<string | null> => {
    try {
      console.log('Generating summary:', summaryType);
      
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: {
          action: 'summarize_text',
          text,
          options: {
            type: summaryType,
            max_length: summaryType === 'brief' ? 100 : 500
          }
        }
      });

      if (error) throw error;
      return data.result || null;

    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast.error(`Failed to generate summary: ${error.message}`);
      return null;
    }
  }, [toast]);

  // Batch analyze multiple documents
  const batchAnalyze = useCallback(async (files: File[]): Promise<DocumentAnalysisResult[]> => {
    const results: DocumentAnalysisResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = Math.round((i / files.length) * 100);
      setAnalysisProgress(progress);
      
      try {
        const result = await analyzeDocument(file);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
      }
    }
    
    return results;
  }, [analyzeDocument]);

  // Compare documents
  const compareDocuments = useCallback(async (
    doc1: string, 
    doc2: string
  ): Promise<{
    similarity: number;
    differences: string[];
    commonTopics: string[];
    uniqueTopics1: string[];
    uniqueTopics2: string[];
  } | null> => {
    try {
      console.log('Comparing documents...');
      
      const { data, error } = await supabase.functions.invoke('document-comparison', {
        body: {
          document1: doc1,
          document2: doc2,
          options: {
            analyze_similarity: true,
            find_differences: true,
            extract_topics: true
          }
        }
      });

      if (error) throw error;
      return data;

    } catch (error: any) {
      console.error('Error comparing documents:', error);
      toast.error(`Failed to compare documents: ${error.message}`);
      return null;
    }
  }, [toast]);

  return {
    // Core functions
    analyzeDocument,
    extractText,
    generateSummary,
    batchAnalyze,
    compareDocuments,
    
    // State
    isAnalyzing,
    analysisProgress
  };
};