
import { useState, useEffect } from 'react';

export const useFocusModeStats = (content: string, timeSpent: number) => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    // Add safety check for undefined/null content
    const safeContent = content || '';
    const text = safeContent.replace(/<[^>]*>/g, ''); // Remove HTML tags for accurate count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharacterCount(text.length);
  }, [content]);

  const wpm = timeSpent > 0 ? Math.round((wordCount / timeSpent) * 60) : 0;

  return { wordCount, characterCount, wpm };
};
