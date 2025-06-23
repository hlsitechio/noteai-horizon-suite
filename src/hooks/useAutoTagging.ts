
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
      return [];
    }

    setIsGeneratingTags(true);
    
    try {
      console.log('Generating tags for:', { title: title.substring(0, 50), contentLength: content.length });
      
      const { data, error } = await supabase.functions.invoke('generate-note-tags', {
        body: { title, content }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.tags) {
        console.error('Invalid response from tag generation:', data);
        return [];
      }

      console.log('Generated tags:', data.tags);
      return data.tags;

    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error('Failed to generate tags automatically');
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
