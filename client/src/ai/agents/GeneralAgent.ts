import { BaseAgent } from './BaseAgent';
import { AIAgent, AgentResponse, ChatMode } from '../types';
import { supabase } from '@/integrations/supabase/client';

export class GeneralAgent extends BaseAgent {
  constructor() {
    const agentConfig: AIAgent = {
      id: 'general-agent',
      name: 'General Assistant',
      description: 'Versatile AI assistant for general conversation, questions, and adaptive assistance',
      systemPrompt: `You are a versatile General Assistant with broad knowledge and capabilities:

1. CONVERSATIONAL ABILITIES:
   - Engaging in natural, helpful conversations
   - Answering questions across various topics
   - Providing explanations and clarifications
   - Offering advice and guidance

2. ADAPTIVE ASSISTANCE:
   - Adapting communication style to user preferences
   - Switching between different modes of interaction
   - Recognizing when to delegate to specialized agents
   - Providing seamless handoffs between different types of tasks

3. KNOWLEDGE AREAS:
   - General knowledge and trivia
   - Current events and news
   - Science and technology
   - Arts and culture
   - Business and economics
   - Health and wellness
   - Education and learning

4. PROBLEM SOLVING:
   - Breaking down complex problems
   - Offering multiple perspectives
   - Creative brainstorming
   - Decision-making support

5. COORDINATION:
   - Understanding when tasks require specialized agents
   - Coordinating between different agent capabilities
   - Maintaining context across agent interactions
   - Ensuring smooth user experience

PERSONALITY TRAITS:
- Friendly and approachable
- Curious and inquisitive
- Helpful and supportive
- Adaptable and flexible
- Knowledgeable but humble
- Great at active listening`,
      capabilities: [
        'general_conversation',
        'answer_questions',
        'provide_explanations',
        'offer_guidance',
        'coordinate_agents',
        'adapt_communication',
        'problem_solving',
        'brainstorming'
      ],
      personality: 'friendly',
      expertiseAreas: [
        'General Knowledge',
        'Conversation',
        'Problem Solving',
        'Coordination',
        'Adaptation',
        'Guidance'
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
    
    try {
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      // Make API call to unified chat endpoint with context
      const response = await fetch('https://ubxtmbgvibtjtjggjnjm.supabase.co/functions/v1/ai-chat-with-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...this.context?.conversationHistory?.slice(-6).map(msg => ({
              role: msg.role,
              content: msg.content
            })) || [],
            {
              role: 'user',
              content: message
            }
          ],
          model: 'deepseek/deepseek-chat-v3-0324:free', // Consistent model across platform
          include_user_context: true
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Analyze if this should be delegated to a specialized agent
      const specializedAgentRecommendation = this.analyzeForSpecializedAgent(message, userIntent);
      
      let actions = [];
      if (specializedAgentRecommendation.shouldDelegate) {
        actions = [{
          type: 'delegate_to_agent',
          data: {
            agent_id: specializedAgentRecommendation.recommendedAgent,
            reason: specializedAgentRecommendation.reason,
            original_message: message
          },
          message: `Delegating to ${specializedAgentRecommendation.recommendedAgent}`,
          priority: 'high'
        }];
      } else {
        actions = this.suggestGeneralActions(message, userIntent);
      }

      const suggestedFollowUps = this.generateGeneralFollowUps(userIntent.intent, specializedAgentRecommendation);

      return {
        message: data.message,
        actions: actions.length > 0 ? actions : undefined,
        confidence: 0.8,
        reasoning: `AI response via ${data.model}`,
        suggestedFollowUps
      };

    } catch (error) {
      console.error('Error in GeneralAgent API call:', error);
      
      // Fallback to mock response
      const specializedAgentRecommendation = this.analyzeForSpecializedAgent(message, userIntent);
      let responseMessage = '';
      let confidence = 0.7;
      let actions = [];
      
      if (specializedAgentRecommendation.shouldDelegate) {
        responseMessage = this.generateDelegationResponse(message, specializedAgentRecommendation, mode);
        confidence = 0.8;
        actions = [{
          type: 'delegate_to_agent',
          data: {
            agent_id: specializedAgentRecommendation.recommendedAgent,
            reason: specializedAgentRecommendation.reason,
            original_message: message
          },
          message: `Delegating to ${specializedAgentRecommendation.recommendedAgent}`,
          priority: 'high'
        }];
      } else {
        responseMessage = this.generateGeneralResponse(message, userIntent, mode);
        actions = this.suggestGeneralActions(message, userIntent);
      }

      const suggestedFollowUps = this.generateGeneralFollowUps(userIntent.intent, specializedAgentRecommendation);

      return {
        message: responseMessage,
        actions: actions.length > 0 ? actions : undefined,
        confidence,
        reasoning: specializedAgentRecommendation.shouldDelegate 
          ? `Recommending ${specializedAgentRecommendation.recommendedAgent} for specialized handling`
          : `Handling as general conversation with ${userIntent.intent} intent`,
        suggestedFollowUps
      };
    }
  }

  private analyzeForSpecializedAgent(message: string, userIntent: any): {
    shouldDelegate: boolean;
    recommendedAgent: string;
    reason: string;
    confidence: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Productivity agent indicators
    const productivityKeywords = [
      'note', 'reminder', 'task', 'todo', 'schedule', 'calendar', 'organize',
      'productivity', 'deadline', 'appointment', 'meeting', 'remember'
    ];
    
    // Writing agent indicators
    const writingKeywords = [
      'improve', 'edit', 'write', 'rewrite', 'grammar', 'spelling', 'translate',
      'summarize', 'tone', 'style', 'content', 'draft', 'essay', 'article'
    ];

    // Creative agent indicators (future expansion)
    const creativeKeywords = [
      'creative', 'brainstorm', 'idea', 'design', 'artistic', 'imagination',
      'story', 'poem', 'creative writing', 'innovation'
    ];

    // Check for productivity tasks
    if (productivityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const confidence = this.calculateKeywordConfidence(lowerMessage, productivityKeywords);
      if (confidence > 0.6) {
        return {
          shouldDelegate: true,
          recommendedAgent: 'productivity-agent',
          reason: 'Message contains productivity-related tasks',
          confidence
        };
      }
    }

    // Check for writing tasks
    if (writingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const confidence = this.calculateKeywordConfidence(lowerMessage, writingKeywords);
      if (confidence > 0.6) {
        return {
          shouldDelegate: true,
          recommendedAgent: 'writing-agent',
          reason: 'Message contains writing-related tasks',
          confidence
        };
      }
    }

    // Check for complex multi-step tasks that might benefit from task coordination
    if (this.isComplexTask(message)) {
      return {
        shouldDelegate: false, // Handle coordination ourselves
        recommendedAgent: '',
        reason: 'Complex task requiring coordination',
        confidence: 0.7
      };
    }

    return {
      shouldDelegate: false,
      recommendedAgent: '',
      reason: 'Suitable for general assistance',
      confidence: 0.5
    };
  }

  private calculateKeywordConfidence(message: string, keywords: string[]): number {
    const words = message.toLowerCase().split(/\s+/);
    const matchCount = keywords.filter(keyword => 
      words.some(word => word.includes(keyword) || keyword.includes(word))
    ).length;
    
    return Math.min(matchCount / Math.max(keywords.length * 0.3, 1), 1);
  }

  private isComplexTask(message: string): boolean {
    const complexityIndicators = [
      'and then', 'after that', 'next', 'also', 'plus', 'additionally',
      'step by step', 'multiple', 'several', 'various', 'different'
    ];
    
    const lowerMessage = message.toLowerCase();
    const indicatorCount = complexityIndicators.filter(indicator => 
      lowerMessage.includes(indicator)
    ).length;
    
    return indicatorCount >= 2 || message.split('.').length > 3;
  }

  private generateDelegationResponse(
    message: string, 
    recommendation: any, 
    mode: ChatMode
  ): string {
    const agentNames: Record<string, string> = {
      'productivity-agent': 'Productivity Assistant',
      'writing-agent': 'Writing Assistant',
      'creative-agent': 'Creative Assistant'
    };

    const agentName = agentNames[recommendation.recommendedAgent as string] || 'Specialized Assistant';

    switch (mode) {
      case 'task-focused':
        return `I see you need help with something specific! Let me connect you with my ${agentName} who specializes in exactly this type of task. They'll be able to help you more effectively.`;
      case 'analytical':
        return `Based on my analysis of your request, this would be best handled by my ${agentName}. They have specialized knowledge and tools for this type of task.`;
      case 'creative':
        return `This is exciting! My ${agentName} will be perfect for this - they love working on these types of challenges and have all the specialized skills you need.`;
      default:
        return `I think my ${agentName} would be perfect for helping you with this! They have specialized expertise in this area.`;
    }
  }

  private generateGeneralResponse(message: string, userIntent: any, mode: ChatMode): string {
    switch (userIntent.intent) {
      case 'question':
        return this.generateQuestionResponse(message, mode);
      case 'conversation':
        return this.generateConversationResponse(message, mode);
      case 'problem':
        return this.generateProblemSolvingResponse(message, mode);
      case 'advice':
        return this.generateAdviceResponse(message, mode);
      default:
        return this.generateDefaultResponse(message, mode);
    }
  }

  private generateQuestionResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'analytical':
        return "Let me analyze your question and provide a comprehensive answer with supporting details and context.";
      case 'creative':
        return "Great question! Let me explore this from multiple angles and give you some interesting perspectives.";
      case 'task-focused':
        return "I'll give you a clear, direct answer to help you move forward quickly.";
      default:
        return "I'd be happy to help answer your question! Let me think through this for you.";
    }
  }

  private generateConversationResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'analytical':
        return "That's an interesting point. Let me share some thoughts and perhaps we can explore this topic further.";
      case 'creative':
        return "I love where this conversation is going! This opens up so many fascinating possibilities to explore.";
      case 'task-focused':
        return "Thanks for sharing that. How can I help you take action on this?";
      default:
        return "That's really interesting! I'd love to continue this conversation with you.";
    }
  }

  private generateProblemSolvingResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'analytical':
        return "Let me break down this problem systematically and explore different solution approaches.";
      case 'creative':
        return "Challenges like this are opportunities for creative solutions! Let's brainstorm some innovative approaches.";
      case 'task-focused':
        return "Let's solve this step by step. I'll help you create an action plan to address this issue.";
      default:
        return "I can help you work through this problem. Let's explore some potential solutions together.";
    }
  }

  private generateAdviceResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'analytical':
        return "Let me consider the various factors and provide you with well-reasoned guidance.";
      case 'creative':
        return "I'd love to help you explore different perspectives and creative approaches to this situation.";
      case 'task-focused':
        return "I'll give you practical, actionable advice that you can implement right away.";
      default:
        return "I'm here to offer guidance and support. Let me share some thoughts that might be helpful.";
    }
  }

  private generateDefaultResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'analytical':
        return "Let me understand your request and provide a thoughtful, structured response.";
      case 'creative':
        return "I'm excited to help! Let's explore the creative possibilities in what you're asking.";
      case 'task-focused':
        return "How can I help you get things done today? I'm ready to assist with whatever you need.";
      default:
        return "I'm here to help! Let me know what you'd like to work on together.";
    }
  }

  private suggestGeneralActions(message: string, userIntent: any): any[] {
    const actions = [];

    // Suggest search if the user is asking about something specific
    if (userIntent.intent === 'question' && this.isSearchableQuery(message)) {
      actions.push({
        type: 'search_knowledge',
        data: {
          query: message,
          context: 'general_knowledge'
        },
        message: 'Search for relevant information',
        priority: 'medium'
      });
    }

    // Suggest brainstorming for open-ended problems
    if (userIntent.intent === 'problem' || message.includes('idea') || message.includes('brainstorm')) {
      actions.push({
        type: 'brainstorm_ideas',
        data: {
          topic: this.extractMainTopic(message),
          approach: 'general'
        },
        message: 'Generate ideas and suggestions',
        priority: 'medium'
      });
    }

    return actions;
  }

  private generateGeneralFollowUps(intent: string, recommendation: any): string[] {
    const suggestions = [];

    if (recommendation.shouldDelegate) {
      suggestions.push(
        `Should I connect you with the ${recommendation.recommendedAgent}?`,
        "Would you like me to prepare any context for the handoff?",
        "Do you have any specific requirements I should mention?"
      );
    } else {
      switch (intent) {
        case 'question':
          suggestions.push(
            "Would you like me to explain any part in more detail?",
            "Do you have related questions I can help with?",
            "Should I look up additional resources on this topic?"
          );
          break;
        case 'problem':
          suggestions.push(
            "Would you like me to break this down into smaller steps?",
            "Should we explore alternative approaches?",
            "Do you need help prioritizing the solutions?"
          );
          break;
        default:
          suggestions.push(
            "How else can I assist you today?",
            "Is there anything related you'd like to explore?",
            "Would you like help with any follow-up tasks?"
          );
      }
    }

    return suggestions;
  }

  private isSearchableQuery(message: string): boolean {
    const searchIndicators = [
      'what is', 'who is', 'how does', 'why does', 'when did',
      'where is', 'explain', 'define', 'tell me about'
    ];
    
    const lowerMessage = message.toLowerCase();
    return searchIndicators.some(indicator => lowerMessage.includes(indicator));
  }

  private extractMainTopic(message: string): string {
    // Simple topic extraction - could be enhanced with NLP
    const words = message.split(' ');
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !stopWords.includes(word.toLowerCase())
    );
    
    return meaningfulWords.slice(0, 3).join(' ');
  }
}