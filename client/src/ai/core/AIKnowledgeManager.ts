import { 
  SharedKnowledge, 
  ContextualMemory, 
  WorkingPattern, 
  Note, 
  UserPreferences,
  AIAction 
} from '../types';

export class AIKnowledgeManager {
  private sharedKnowledge: SharedKnowledge;

  constructor() {
    this.sharedKnowledge = this.initializeSharedKnowledge();
    this.loadFromStorage();
  }

  private initializeSharedKnowledge(): SharedKnowledge {
    return {
      userNotes: [],
      recentActions: [],
      contextualMemory: [],
      preferences: {
        communicationStyle: 'conversational',
        taskManagementStyle: 'flexible',
        notificationLevel: 'medium',
        preferredLanguage: 'english',
        aiPersonality: 'friendly'
      },
      workingPatterns: []
    };
  }

  public getSharedKnowledge(): SharedKnowledge {
    return { ...this.sharedKnowledge };
  }

  public updateUserPreferences(preferences: Partial<UserPreferences>): void {
    this.sharedKnowledge.preferences = {
      ...this.sharedKnowledge.preferences,
      ...preferences
    };
    this.saveToStorage();
  }

  public addNote(note: Note): void {
    this.sharedKnowledge.userNotes.push(note);
    this.addContextualMemory({
      id: `note-context-${Date.now()}`,
      context: `User created note: ${note.title}`,
      insights: [`Topic: ${note.category || 'general'}`, `Tags: ${note.tags.join(', ')}`],
      importance: this.calculateNoteImportance(note),
      timestamp: new Date(),
      relatedTopics: note.tags
    });
    this.saveToStorage();
  }

  public updateNote(noteId: string, updates: Partial<Note>): void {
    const noteIndex = this.sharedKnowledge.userNotes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      this.sharedKnowledge.userNotes[noteIndex] = {
        ...this.sharedKnowledge.userNotes[noteIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.saveToStorage();
    }
  }

  public deleteNote(noteId: string): void {
    this.sharedKnowledge.userNotes = this.sharedKnowledge.userNotes.filter(
      note => note.id !== noteId
    );
    this.saveToStorage();
  }

  public searchNotes(query: string, tags?: string[], category?: string): Note[] {
    const lowerQuery = query.toLowerCase();
    
    return this.sharedKnowledge.userNotes.filter(note => {
      const matchesQuery = 
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery);
      
      const matchesTags = !tags || tags.length === 0 || 
        tags.some(tag => note.tags.includes(tag));
      
      const matchesCategory = !category || note.category === category;
      
      return matchesQuery && matchesTags && matchesCategory;
    });
  }

  public addRecentAction(action: AIAction): void {
    this.sharedKnowledge.recentActions.push(action);
    
    // Keep only the last 50 actions
    if (this.sharedKnowledge.recentActions.length > 50) {
      this.sharedKnowledge.recentActions = this.sharedKnowledge.recentActions.slice(-50);
    }
    
    this.updateWorkingPatterns(action);
    this.saveToStorage();
  }

  public addContextualMemory(memory: ContextualMemory): void {
    this.sharedKnowledge.contextualMemory.push(memory);
    
    // Keep only the most important and recent memories (max 100)
    if (this.sharedKnowledge.contextualMemory.length > 100) {
      this.sharedKnowledge.contextualMemory = this.sharedKnowledge.contextualMemory
        .sort((a, b) => b.importance - a.importance || b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 100);
    }
    
    this.saveToStorage();
  }

  public getRelevantContext(query: string, limit: number = 5): ContextualMemory[] {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 2);
    
    return this.sharedKnowledge.contextualMemory
      .map(memory => ({
        ...memory,
        relevanceScore: this.calculateRelevanceScore(memory, queryWords)
      }))
      .filter(memory => memory.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  public getWorkingPatterns(): WorkingPattern[] {
    return [...this.sharedKnowledge.workingPatterns];
  }

  public analyzeUserBehavior(): {
    preferredTimes: string[];
    commonActivities: string[];
    effectivenessPatterns: { activity: string; bestTime: string; effectiveness: number }[];
  } {
    const patterns = this.sharedKnowledge.workingPatterns;
    
    // Analyze preferred times
    const timeEffectiveness = patterns.reduce((acc, pattern) => {
      if (!acc[pattern.timeOfDay]) {
        acc[pattern.timeOfDay] = { total: 0, count: 0 };
      }
      acc[pattern.timeOfDay].total += pattern.effectiveness;
      acc[pattern.timeOfDay].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const preferredTimes = Object.entries(timeEffectiveness)
      .map(([time, data]) => ({ time, avgEffectiveness: data.total / data.count }))
      .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
      .slice(0, 3)
      .map(item => item.time);

    // Analyze common activities
    const activityCounts = patterns.reduce((acc, pattern) => {
      acc[pattern.activityType] = (acc[pattern.activityType] || 0) + pattern.frequency;
      return acc;
    }, {} as Record<string, number>);

    const commonActivities = Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([activity]) => activity);

    // Analyze effectiveness patterns
    const effectivenessPatterns = patterns
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5)
      .map(pattern => ({
        activity: pattern.activityType,
        bestTime: pattern.timeOfDay,
        effectiveness: pattern.effectiveness
      }));

    return {
      preferredTimes,
      commonActivities,
      effectivenessPatterns
    };
  }

  public clearOldData(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Clear old contextual memories
    this.sharedKnowledge.contextualMemory = this.sharedKnowledge.contextualMemory
      .filter(memory => memory.timestamp > cutoffDate);

    // Keep only high-importance or recent notes
    this.sharedKnowledge.userNotes = this.sharedKnowledge.userNotes
      .filter(note => 
        note.updatedAt > cutoffDate || 
        this.calculateNoteImportance(note) > 0.7
      );

    this.saveToStorage();
  }

  private calculateNoteImportance(note: Note): number {
    let importance = 0.5; // Base importance
    
    // More tags suggest more structured/important content
    importance += Math.min(note.tags.length * 0.1, 0.3);
    
    // Longer content might be more important
    if (note.content.length > 500) importance += 0.2;
    
    // Recent notes are more important
    const daysOld = (Date.now() - note.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 7) importance += 0.2;
    else if (daysOld < 30) importance += 0.1;
    
    // Certain keywords suggest higher importance
    const importantKeywords = ['important', 'urgent', 'deadline', 'meeting', 'project'];
    const hasImportantKeywords = importantKeywords.some(keyword => 
      note.title.toLowerCase().includes(keyword) || 
      note.content.toLowerCase().includes(keyword)
    );
    if (hasImportantKeywords) importance += 0.3;
    
    return Math.min(importance, 1.0);
  }

  private calculateRelevanceScore(memory: ContextualMemory, queryWords: string[]): number {
    let score = 0;
    const contextLower = memory.context.toLowerCase();
    const insightsLower = memory.insights.join(' ').toLowerCase();
    const topicsLower = memory.relatedTopics.join(' ').toLowerCase();
    
    // Check query words against context, insights, and topics
    queryWords.forEach(word => {
      if (contextLower.includes(word)) score += 0.3;
      if (insightsLower.includes(word)) score += 0.2;
      if (topicsLower.includes(word)) score += 0.2;
    });
    
    // Factor in importance and recency
    score *= memory.importance;
    
    const daysOld = (Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld < 7) score *= 1.2;
    else if (daysOld < 30) score *= 1.1;
    else if (daysOld > 90) score *= 0.8;
    
    return Math.min(score, 1.0);
  }

  private updateWorkingPatterns(action: AIAction): void {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const activityType = this.mapActionToActivity(action.type);
    
    // Find existing pattern or create new one
    const existingPattern = this.sharedKnowledge.workingPatterns.find(
      pattern => pattern.timeOfDay === timeOfDay && pattern.activityType === activityType
    );
    
    if (existingPattern) {
      existingPattern.frequency += 1;
      // Assume moderate effectiveness for now - could be enhanced with user feedback
      existingPattern.effectiveness = (existingPattern.effectiveness + 0.7) / 2;
    } else {
      this.sharedKnowledge.workingPatterns.push({
        timeOfDay,
        activityType,
        frequency: 1,
        effectiveness: 0.7 // Default moderate effectiveness
      });
    }
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    
    if (hour < 6) return 'late-night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private mapActionToActivity(actionType: string): string {
    const mapping: Record<string, string> = {
      'create_note': 'note-taking',
      'set_reminder': 'planning',
      'search_notes': 'information-retrieval',
      'improve_text': 'writing',
      'summarize_text': 'analysis',
      'translate_text': 'translation',
      'check_grammar': 'editing'
    };
    
    return mapping[actionType] || 'general';
  }

  private saveToStorage(): void {
    try {
      const serializedData = {
        ...this.sharedKnowledge,
        contextualMemory: this.sharedKnowledge.contextualMemory.map(memory => ({
          ...memory,
          timestamp: memory.timestamp.toISOString()
        })),
        userNotes: this.sharedKnowledge.userNotes.map(note => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString()
        }))
      };
      
      localStorage.setItem('ai_shared_knowledge', JSON.stringify(serializedData));
    } catch (error) {
      console.error('Failed to save shared knowledge to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('ai_shared_knowledge');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Deserialize dates
        if (data.contextualMemory) {
          data.contextualMemory = data.contextualMemory.map((memory: any) => ({
            ...memory,
            timestamp: new Date(memory.timestamp)
          }));
        }
        
        if (data.userNotes) {
          data.userNotes = data.userNotes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          }));
        }
        
        this.sharedKnowledge = { ...this.sharedKnowledge, ...data };
      }
    } catch (error) {
      console.error('Failed to load shared knowledge from storage:', error);
    }
  }
}
