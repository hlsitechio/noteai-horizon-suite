import { AIAgent, AIContext, AIMessage, AgentResponse, ChatMode } from '../types';

export abstract class BaseAgent {
  protected agent: AIAgent;
  protected context: AIContext;

  constructor(agent: AIAgent) {
    this.agent = agent;
  }

  public setContext(context: AIContext): void {
    this.context = context;
  }

  public getAgent(): AIAgent {
    return this.agent;
  }

  public abstract processMessage(
    message: string,
    mode: ChatMode,
    additionalContext?: any
  ): Promise<AgentResponse>;

  protected buildSystemPrompt(mode: ChatMode): string {
    const basePrompt = this.agent.systemPrompt;
    const modeSpecificPrompt = this.getModeSpecificPrompt(mode);
    const contextualPrompt = this.buildContextualPrompt();
    
    return `${basePrompt}

${modeSpecificPrompt}

${contextualPrompt}

SHARED KNOWLEDGE CONTEXT:
${this.buildSharedKnowledgePrompt()}`;
  }

  protected getModeSpecificPrompt(mode: ChatMode): string {
    switch (mode) {
      case 'general':
        return `MODE: General Conversation
- Engage in natural, helpful conversation
- Be friendly and supportive
- Offer relevant suggestions when appropriate
- Keep responses conversational but informative`;

      case 'task-focused':
        return `MODE: Task-Focused Assistance
- Focus on getting things done efficiently
- Suggest concrete actions and next steps
- Be direct and action-oriented
- Prioritize productivity and results
- Break down complex tasks into manageable steps`;

      case 'creative':
        return `MODE: Creative Assistance
- Encourage creative thinking and exploration
- Offer multiple perspectives and ideas
- Be imaginative and inspiring
- Help brainstorm and develop concepts
- Support innovative approaches`;

      case 'analytical':
        return `MODE: Analytical Assistance
- Focus on data, logic, and systematic thinking
- Provide structured analysis and reasoning
- Break down problems methodically
- Offer evidence-based insights
- Be precise and thorough in explanations`;

      default:
        return `MODE: Adaptive Assistance
- Adapt to the user's communication style and needs
- Balance different approaches as appropriate`;
    }
  }

  protected buildContextualPrompt(): string {
    if (!this.context) return '';

    const userProfile = this.context.userProfile;
    const preferences = this.context.preferences;
    const currentTask = this.context.currentTask;

    let prompt = '\nCONTEXTUAL INFORMATION:\n';

    if (userProfile) {
      prompt += `User Profile:
- Name: ${userProfile.displayName || 'User'}
- Working Style: ${userProfile.workingStyle || 'Not specified'}
- Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
- Timezone: ${userProfile.timezone || 'Not specified'}\n`;
    }

    if (preferences) {
      prompt += `User Preferences:
- Communication Style: ${preferences.communicationStyle}
- Task Management: ${preferences.taskManagementStyle}
- AI Personality: ${preferences.aiPersonality}
- Language: ${preferences.preferredLanguage}\n`;
    }

    if (currentTask) {
      prompt += `Current Task Context:
- Type: ${currentTask.type}
- Description: ${currentTask.description}
- Priority: ${currentTask.priority}
- Complexity: ${currentTask.complexity}
- Deadline: ${currentTask.deadline ? currentTask.deadline.toISOString() : 'None'}\n`;
    }

    return prompt;
  }

  protected buildSharedKnowledgePrompt(): string {
    if (!this.context?.sharedKnowledge) return '';

    const knowledge = this.context.sharedKnowledge;
    let prompt = '';

    // Recent notes (limit to most relevant)
    const recentNotes = knowledge.userNotes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    if (recentNotes.length > 0) {
      prompt += `Recent User Notes:
${recentNotes.map(note => `- ${note.title}: ${note.content.substring(0, 100)}...`).join('\n')}\n`;
    }

    // Recent actions
    const recentActions = knowledge.recentActions.slice(-3);
    if (recentActions.length > 0) {
      prompt += `Recent Actions:
${recentActions.map(action => `- ${action.type}: ${action.message || 'No description'}`).join('\n')}\n`;
    }

    // Contextual insights
    const relevantMemories = knowledge.contextualMemory
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3);

    if (relevantMemories.length > 0) {
      prompt += `Relevant Context:
${relevantMemories.map(memory => `- ${memory.context}: ${memory.insights.join(', ')}`).join('\n')}\n`;
    }

    // Working patterns
    if (knowledge.workingPatterns.length > 0) {
      const topPatterns = knowledge.workingPatterns
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, 2);
      
      prompt += `Working Patterns:
${topPatterns.map(pattern => `- ${pattern.timeOfDay}: ${pattern.activityType} (effectiveness: ${pattern.effectiveness})`).join('\n')}\n`;
    }

    return prompt;
  }

  protected analyzeUserIntent(message: string, conversationHistory: AIMessage[]): {
    intent: string;
    confidence: number;
    extractedEntities: Record<string, any>;
  } {
    // Basic intent analysis - can be enhanced with more sophisticated NLP
    const lowerMessage = message.toLowerCase();
    
    // Task-related keywords
    const taskKeywords = ['create', 'make', 'add', 'note', 'reminder', 'task', 'todo', 'schedule'];
    const writingKeywords = ['improve', 'edit', 'rewrite', 'summarize', 'translate', 'grammar', 'tone'];
    const searchKeywords = ['find', 'search', 'look', 'show', 'get', 'retrieve'];
    const questionKeywords = ['how', 'what', 'why', 'when', 'where', 'explain', 'help'];

    let intent = 'general';
    let confidence = 0.5;
    const extractedEntities: Record<string, any> = {};

    if (taskKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'task';
      confidence = 0.8;
    } else if (writingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'writing';
      confidence = 0.8;
    } else if (searchKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'search';
      confidence = 0.7;
    } else if (questionKeywords.some(keyword => lowerMessage.includes(keyword))) {
      intent = 'question';
      confidence = 0.6;
    }

    // Extract potential entities
    const datePattern = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|today|tomorrow|next week)/gi;
    const timePattern = /(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/gi;
    
    const dates = message.match(datePattern);
    const times = message.match(timePattern);
    
    if (dates) extractedEntities.dates = dates;
    if (times) extractedEntities.times = times;

    return { intent, confidence, extractedEntities };
  }

  protected determineOptimalMode(
    message: string,
    userIntent: string,
    currentMode: ChatMode
  ): ChatMode {
    // Logic to determine the best mode based on message content and intent
    switch (userIntent) {
      case 'task':
        return 'task-focused';
      case 'writing':
        return 'creative';
      case 'search':
      case 'question':
        return 'analytical';
      default:
        return currentMode; // Keep current mode for general conversation
    }
  }
}