
import { useMemo } from 'react';
import { Note } from '../types/note';

export const useDashboardStats = (notes: Note[]) => {
  return useMemo(() => {
    const totalNotes = notes.length;
    const favoriteNotes = notes.filter(note => note.isFavorite).length;
    const recentNotes = [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
    
    const categoryCounts = notes.reduce((acc, note) => {
      const category = note.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const weeklyNotes = notes.filter(note => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(note.createdAt) > weekAgo;
    }).length;
    
    const totalWords = notes.reduce((acc, note) => {
      const wordCount = note.content?.split(/\s+/).filter(Boolean).length || 0;
      return acc + wordCount;
    }, 0);
    
    const avgWordsPerNote = totalNotes ? Math.round(totalWords / totalNotes) : 0;

    return {
      totalNotes,
      favoriteNotes,
      recentNotes,
      categoryCounts,
      weeklyNotes,
      totalWords,
      avgWordsPerNote
    };
  }, [notes]);
};
