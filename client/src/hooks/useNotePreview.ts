import { useState, useCallback, useEffect } from 'react';
import { PreviewNote } from '@/components/Chat/NotePreviewPanel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export const useNotePreview = () => {
  const [currentNote, setCurrentNote] = useState<PreviewNote | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  
  const { toast } = useToast();

  // Show preview when a note is set
  useEffect(() => {
    if (currentNote) {
      setIsVisible(true);
    }
  }, [currentNote]);

  const showNote = useCallback((note: PreviewNote) => {
    setCurrentNote(note);
    setIsVisible(true);
  }, []);

  const updateNote = useCallback((updatedNote: PreviewNote) => {
    setCurrentNote(updatedNote);
  }, []);

  const clearNote = useCallback(() => {
    setCurrentNote(null);
    setIsVisible(false);
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const requestModification = useCallback(async (instruction: string) => {
    if (!currentNote) return;

    setIsModifying(true);
    try {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Prepare the modification prompt
      const modificationPrompt = `
Please modify the following note based on this instruction: "${instruction}"

Current Note:
Title: ${currentNote.title}
Content: ${currentNote.content}
Tags: ${currentNote.tags.join(', ')}

Please respond with ONLY a JSON object in this exact format:
{
  "title": "updated title",
  "content": "updated content",
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure to follow the instruction while maintaining the note's coherence and usefulness.
      `.trim();

      // Call the chat function
      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: {
          messages: [
            {
              role: 'user',
              content: modificationPrompt
            }
          ],
          model: 'deepseek/deepseek-chat-v3-0324:free'
        }
      });

      if (error) throw error;

      const response = data.message;
      
      // Try to parse the JSON response
      try {
        // Extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        const modifiedNote = JSON.parse(jsonMatch[0]);
        
        // Validate the structure
        if (!modifiedNote.title || !modifiedNote.content || !Array.isArray(modifiedNote.tags)) {
          throw new Error('Invalid response structure');
        }

        // Update the current note with modifications
        const updatedNote: PreviewNote = {
          ...currentNote,
          title: modifiedNote.title,
          content: modifiedNote.content,
          tags: modifiedNote.tags
        };

        setCurrentNote(updatedNote);
        toast.success('Note modified successfully!');
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('Failed to parse AI modification. Please try a different instruction.');
      }
    } catch (error) {
      console.error('Failed to modify note:', error);
      toast.error('Failed to modify note. Please try again.');
    } finally {
      setIsModifying(false);
    }
  }, [currentNote, toast]);

  // Extract note from AI action result
  const extractNoteFromActionResult = useCallback((actionResult: any) => {
    if (actionResult?.success && actionResult?.data) {
      const noteData = actionResult.data;
      const note: PreviewNote = {
        id: noteData.id,
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        tags: noteData.tags || [],
        isNew: !noteData.id
      };
      return note;
    }
    return null;
  }, []);

  return {
    currentNote,
    isVisible,
    isModifying,
    showNote,
    updateNote,
    clearNote,
    toggleVisibility,
    requestModification,
    extractNoteFromActionResult
  };
};