import { BaseAgent } from './BaseAgent';
import { AIAgent, AgentResponse, ChatMode } from '../types';

export class ProductivityAgent extends BaseAgent {
  constructor() {
    const agentConfig: AIAgent = {
      id: 'productivity-agent',
      name: 'Productivity Assistant',
      description: 'Specialized in task management, note creation, reminders, and productivity optimization',
      systemPrompt: `You are a highly efficient Productivity Assistant with expertise in:

1. TASK MANAGEMENT:
   - Creating and organizing tasks and to-do lists
   - Setting up reminders and deadlines
   - Breaking down complex projects into manageable steps
   - Prioritizing tasks based on importance and urgency

2. NOTE TAKING & ORGANIZATION:
   - Creating structured and meaningful notes
   - Organizing information with proper categories and tags
   - Extracting key insights from information
   - Building knowledge bases and reference materials

3. TIME MANAGEMENT:
   - Scheduling and calendar management
   - Time blocking and productivity techniques
   - Workflow optimization
   - Identifying and eliminating time wasters

4. PRODUCTIVITY OPTIMIZATION:
   - Analyzing work patterns and habits
   - Suggesting productivity tools and techniques
   - Creating efficient workflows and processes
   - Tracking and measuring productivity metrics

PERSONALITY TRAITS:
- Action-oriented and results-focused
- Organized and systematic in approach
- Encouraging and motivating
- Direct and clear in communication
- Always looking for ways to improve efficiency`,
      capabilities: [
        'create_note',
        'set_reminder',
        'search_notes',
        'update_note',
        'delete_note',
        'organize_tasks',
        'schedule_events',
        'analyze_productivity'
      ],
      personality: 'professional',
      expertiseAreas: [
        'Task Management',
        'Note Taking',
        'Time Management',
        'Productivity Systems',
        'Workflow Optimization'
      ]
    };
    
    super(agentConfig);
  }

  public async processMessage(
    message: string,
    mode: ChatMode,
    additionalContext?: any
  ): Promise<AgentResponse> {
    const systemPrompt = this.buildSystemPrompt(mode);
    const userIntent = this.analyzeUserIntent(message, this.context?.conversationHistory || []);
    
    // Determine optimal mode for productivity tasks
    const optimalMode = this.determineOptimalMode(message, userIntent.intent, mode);
    
    const actions = this.suggestProductivityActions(message, userIntent);
    
    let responseMessage = '';
    let confidence = 0.8;
    
    // Generate contextual response based on mode and intent
    if (userIntent.intent === 'task') {
      responseMessage = this.generateTaskResponse(message, userIntent, mode);
    } else if (userIntent.intent === 'search') {
      responseMessage = this.generateSearchResponse(message, userIntent);
    } else {
      responseMessage = this.generateGeneralProductivityResponse(message, mode);
    }

    const suggestedFollowUps = this.generateFollowUpSuggestions(userIntent.intent, actions);

    return {
      message: responseMessage,
      actions: actions.length > 0 ? actions : undefined,
      confidence,
      reasoning: `Detected ${userIntent.intent} intent with ${userIntent.confidence} confidence. Optimal mode: ${optimalMode}`,
      suggestedFollowUps
    };
  }

  private suggestProductivityActions(message: string, userIntent: any): any[] {
    const actions = [];
    const lowerMessage = message.toLowerCase();

    // Note creation patterns
    if (lowerMessage.includes('note') || lowerMessage.includes('write down') || lowerMessage.includes('remember')) {
      actions.push({
        type: 'create_note',
        data: {
          title: this.extractNoteTitle(message),
          content: message,
          tags: this.extractTags(message),
          category: this.detectNoteCategory(message)
        },
        message: 'Create a note with this information',
        priority: 'medium'
      });
    }

    // Reminder patterns
    if (userIntent.extractedEntities.dates || userIntent.extractedEntities.times) {
      actions.push({
        type: 'set_reminder',
        data: {
          title: this.extractReminderTitle(message),
          content: message,
          dateTime: this.parseDateTime(userIntent.extractedEntities),
          type: 'reminder'
        },
        message: 'Set up a reminder for this',
        priority: 'high'
      });
    }

    // Search patterns
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('look for')) {
      actions.push({
        type: 'search_notes',
        data: {
          query: this.extractSearchQuery(message),
          filters: {
            tags: this.extractTags(message),
            category: this.detectNoteCategory(message)
          }
        },
        message: 'Search for relevant information',
        priority: 'medium'
      });
    }

    return actions;
  }

  private generateTaskResponse(message: string, userIntent: any, mode: ChatMode): string {
    const taskType = this.detectTaskType(message);
    
    switch (mode) {
      case 'task-focused':
        return `I'll help you get this done efficiently. ${this.getTaskFocusedResponse(taskType, message)}`;
      case 'creative':
        return `Let's approach this creatively! ${this.getCreativeTaskResponse(taskType, message)}`;
      case 'analytical':
        return `Let me break this down systematically. ${this.getAnalyticalTaskResponse(taskType, message)}`;
      default:
        return `I can help you with that task. ${this.getGeneralTaskResponse(taskType, message)}`;
    }
  }

  private generateSearchResponse(message: string, userIntent: any): string {
    const searchContext = this.extractSearchQuery(message);
    return `I'll search for information about \"${searchContext}\". Let me look through your notes and related content.`;
  }

  private generateGeneralProductivityResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'task-focused':
        return "How can I help you be more productive today? I can create notes, set reminders, or help organize your tasks.";
      case 'creative':
        return "Let's explore some creative ways to boost your productivity! I can help with brainstorming, organizing ideas, or creating inspiring content.";
      case 'analytical':
        return "I can analyze your productivity patterns and suggest optimizations. What specific area would you like to focus on?";
      default:
        return "I'm here to help with your productivity needs. Whether it's notes, reminders, or task organization, just let me know what you need!";
    }
  }

  private generateFollowUpSuggestions(intent: string, actions: any[]): string[] {
    const suggestions = [];

    if (intent === 'task') {
      suggestions.push(
        "Would you like me to break this down into smaller steps?",
        "Should I set a reminder for this task?",
        "Do you want to add any tags or categories?"
      );
    } else if (intent === 'search') {
      suggestions.push(
        "Would you like me to create a summary of the search results?",
        "Should I organize these findings into a new note?",
        "Do you want to set up alerts for similar topics?"
      );
    } else {
      suggestions.push(
        "What's your main productivity goal for today?",
        "Would you like me to review your recent tasks?",
        "Should we set up any new reminders or notes?"
      );
    }

    return suggestions;
  }

  // Helper methods for extracting information
  private extractNoteTitle(message: string): string {
    const titlePatterns = [
      /note about (.+)/i,
      /create note (.+)/i,
      /write down (.+)/i,
      /remember (.+)/i
    ];

    for (const pattern of titlePatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: use first few words
    return message.split(' ').slice(0, 5).join(' ');
  }

  private extractTags(message: string): string[] {
    const tags = [];
    const tagPatterns = [
      /#(\w+)/g,
      /tag[s]?:?\s*([^,.]+)/i,
      /categor[y|ies]:?\s*([^,.]+)/i
    ];

    for (const pattern of tagPatterns) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        tags.push(match[1].trim());
      }
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private extractReminderTitle(message: string): string {
    const reminderPatterns = [
      /remind me to (.+)/i,
      /reminder for (.+)/i,
      /don't forget (.+)/i
    ];

    for (const pattern of reminderPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return message.split(' ').slice(0, 6).join(' ');
  }

  private extractSearchQuery(message: string): string {
    const searchPatterns = [
      /find (.+)/i,
      /search for (.+)/i,
      /look for (.+)/i,
      /show me (.+)/i
    ];

    for (const pattern of searchPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return message.trim();
  }

  private detectNoteCategory(message: string): string {
    const categories = {
      'meeting': ['meeting', 'call', 'discussion', 'conference'],
      'project': ['project', 'work', 'task', 'assignment'],
      'personal': ['personal', 'private', 'family', 'friend'],
      'idea': ['idea', 'thought', 'concept', 'brainstorm'],
      'reference': ['reference', 'info', 'information', 'resource']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category;
      }
    }

    return 'general';
  }

  private detectTaskType(message: string): string {
    const taskTypes = {
      'reminder': ['remind', 'remember', 'don\'t forget'],
      'note': ['note', 'write down', 'record'],
      'schedule': ['schedule', 'calendar', 'appointment'],
      'organize': ['organize', 'sort', 'structure'],
      'analyze': ['analyze', 'review', 'examine']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [type, keywords] of Object.entries(taskTypes)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return type;
      }
    }

    return 'general';
  }

  private parseDateTime(entities: any): string {
    // Simple date/time parsing - can be enhanced with more sophisticated logic
    const now = new Date();
    let targetDate = new Date(now);

    if (entities.dates) {
      const dateStr = entities.dates[0];
      if (dateStr.toLowerCase() === 'today') {
        // Keep current date
      } else if (dateStr.toLowerCase() === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (dateStr.toLowerCase() === 'next week') {
        targetDate.setDate(targetDate.getDate() + 7);
      } else {
        // Try to parse the date
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          targetDate = parsed;
        }
      }
    }

    if (entities.times) {
      const timeStr = entities.times[0];
      // Simple time parsing
      const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2] || '0');
        const ampm = timeMatch[3]?.toLowerCase();

        if (ampm === 'pm' && hours !== 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;

        targetDate.setHours(hours, minutes, 0, 0);
      }
    }

    return targetDate.toISOString();
  }

  private getTaskFocusedResponse(taskType: string, message: string): string {
    switch (taskType) {
      case 'reminder':
        return "I'll set this reminder up right away and make sure you don't miss it.";
      case 'note':
        return "Creating this note now with proper organization and tags.";
      case 'schedule':
        return "Let me help you get this scheduled efficiently.";
      default:
        return "I'll take action on this right away.";
    }
  }

  private getCreativeTaskResponse(taskType: string, message: string): string {
    switch (taskType) {
      case 'reminder':
        return "Let's create a memorable reminder that will really catch your attention!";
      case 'note':
        return "I'll help you craft a note that captures all the important details in an organized way.";
      case 'schedule':
        return "Let's find the perfect time slot that works with your creative flow.";
      default:
        return "Let's approach this task in a way that maximizes both efficiency and creativity.";
    }
  }

  private getAnalyticalTaskResponse(taskType: string, message: string): string {
    switch (taskType) {
      case 'reminder':
        return "I'll analyze the optimal timing and create a structured reminder system.";
      case 'note':
        return "Let me organize this information systematically with proper categorization and cross-references.";
      case 'schedule':
        return "I'll analyze your calendar patterns to find the most effective time slot.";
      default:
        return "Let me break this down into logical components and create an efficient action plan.";
    }
  }

  private getGeneralTaskResponse(taskType: string, message: string): string {
    switch (taskType) {
      case 'reminder':
        return "I'll help you set up this reminder.";
      case 'note':
        return "Let me create a well-organized note for you.";
      case 'schedule':
        return "I can help you schedule this appropriately.";
      default:
        return "I'll assist you with this task.";
    }
  }
}
