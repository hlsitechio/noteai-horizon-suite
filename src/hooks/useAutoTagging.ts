
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const useAutoTagging = () => {
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const generateTags = async (title: string, content: string): Promise<string[]> => {
    if (!title.trim() && !content.trim()) {
      console.log('No title or content provided for tag generation');
      return [];
    }

    setIsGeneratingTags(true);
    
    try {
      console.log('Starting tag generation for:', { 
        title: title.substring(0, 50), 
        contentLength: content.length,
        supabaseUrl: supabaseUrl ? 'configured' : 'missing',
        supabaseKey: supabaseKey ? 'configured' : 'missing'
      });
      
      // Show loading toast
      const loadingToast = toast.loading('Generating tags automatically...');
      
      const { data, error } = await supabase.functions.invoke('generate-note-tags', {
        body: { title, content }
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (error) {
        console.error('Supabase function error:', error);
        toast.error(`Failed to generate tags: ${error.message}`);
        return [];
      }

      if (!data) {
        console.error('No data returned from tag generation function');
        toast.error('No response from tag generation service');
        return [];
      }

      if (!data.tags || !Array.isArray(data.tags)) {
        console.error('Invalid response format from tag generation:', data);
        toast.error('Invalid response from tag generation service');
        return [];
      }

      console.log('Successfully generated tags:', data.tags);
      
      if (data.tags.length > 0) {
        toast.success(`Generated ${data.tags.length} tags automatically`);
      } else {
        toast.info('No relevant tags could be generated for this content');
      }
      
      return data.tags;

    } catch (error: any) {
      console.error('Error generating tags:', error);
      
      // More specific error messages
      if (error.message?.includes('Function not found')) {
        toast.error('Tag generation service not available');
      } else if (error.message?.includes('network')) {
        toast.error('Network error while generating tags');
      } else {
        toast.error(`Failed to generate tags: ${error.message || 'Unknown error'}`);
      }
      
      return [];
    } finally {
      setIsGeneratingTags(false);
    }
  };

  return {
    generateTags,
    isGeneratingTags
  };
};
