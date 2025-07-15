import { BaseAgent } from './BaseAgent';
import { AIAgent, AgentResponse, ChatMode } from '../types';

export class WritingAgent extends BaseAgent {
  constructor() {
    const agentConfig: AIAgent = {
      id: 'writing-agent',
      name: 'Writing Assistant',
      description: 'Specialized in text improvement, content creation, editing, and writing enhancement',
      systemPrompt: `You are an expert Writing Assistant with deep expertise in:

1. CONTENT IMPROVEMENT:
   - Enhancing clarity, flow, and readability
   - Improving sentence structure and word choice
   - Eliminating redundancy and improving conciseness
   - Enhancing engagement and impact

2. EDITING & PROOFREADING:
   - Grammar, spelling, and punctuation correction
   - Style consistency and tone adjustment
   - Fact-checking and accuracy verification
   - Formatting and structure optimization

3. CREATIVE WRITING:
   - Storytelling and narrative development
   - Character development and dialogue
   - Creative brainstorming and ideation
   - Genre-specific writing techniques

4. PROFESSIONAL WRITING:
   - Business communication and correspondence
   - Technical writing and documentation
   - Academic writing and research papers
   - Marketing copy and content creation

5. TRANSLATION & LOCALIZATION:
   - Accurate translation between languages
   - Cultural context and localization
   - Tone and style preservation
   - Technical terminology handling

PERSONALITY TRAITS:
- Creative and imaginative
- Detail-oriented and precise
- Encouraging and constructive
- Adaptable to different writing styles
- Passionate about language and communication`,
      capabilities: [
        'improve_text',
        'summarize_text',
        'translate_text',
        'check_grammar',
        'adjust_tone',
        'expand_content',
        'extract_keywords',
        'create_content',
        'edit_text',
        'brainstorm_ideas'
      ],
      personality: 'creative',
      expertiseAreas: [
        'Content Creation',
        'Text Editing',
        'Grammar & Style',
        'Creative Writing',
        'Technical Writing',
        'Translation',
        'Content Strategy'
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
    
    const writingAnalysis = this.analyzeWritingRequest(message);
    const actions = this.suggestWritingActions(message, userIntent, writingAnalysis);
    
    let responseMessage = '';
    let confidence = 0.85;
    
    // Generate contextual response based on writing task type
    if (writingAnalysis.taskType === 'improvement') {
      responseMessage = this.generateImprovementResponse(message, writingAnalysis, mode);
    } else if (writingAnalysis.taskType === 'creation') {
      responseMessage = this.generateCreationResponse(message, writingAnalysis, mode);
    } else if (writingAnalysis.taskType === 'editing') {
      responseMessage = this.generateEditingResponse(message, writingAnalysis, mode);
    } else {
      responseMessage = this.generateGeneralWritingResponse(message, mode);
    }

    const suggestedFollowUps = this.generateWritingFollowUps(writingAnalysis.taskType, writingAnalysis);

    return {
      message: responseMessage,
      actions: actions.length > 0 ? actions : undefined,
      confidence,
      reasoning: `Detected ${writingAnalysis.taskType} writing task with ${writingAnalysis.textType} content type`,
      suggestedFollowUps
    };
  }

  private analyzeWritingRequest(message: string): {
    taskType: string;
    textType: string;
    targetText: string;
    requirements: string[];
    complexity: string;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Determine task type
    let taskType = 'general';
    if (lowerMessage.includes('improve') || lowerMessage.includes('enhance') || lowerMessage.includes('better')) {
      taskType = 'improvement';
    } else if (lowerMessage.includes('create') || lowerMessage.includes('write') || lowerMessage.includes('draft')) {
      taskType = 'creation';
    } else if (lowerMessage.includes('edit') || lowerMessage.includes('fix') || lowerMessage.includes('correct')) {
      taskType = 'editing';
    } else if (lowerMessage.includes('translate')) {
      taskType = 'translation';
    } else if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      taskType = 'summarization';
    }

    // Determine text type
    let textType = 'general';
    const textTypes = {
      'email': ['email', 'message', 'correspondence'],
      'essay': ['essay', 'paper', 'article'],
      'report': ['report', 'analysis', 'document'],
      'creative': ['story', 'poem', 'creative', 'fiction'],
      'business': ['proposal', 'business', 'professional', 'formal'],
      'academic': ['academic', 'research', 'thesis', 'scholarly'],
      'marketing': ['marketing', 'copy', 'advertisement', 'promotional']
    };

    for (const [type, keywords] of Object.entries(textTypes)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        textType = type;
        break;
      }
    }

    // Extract target text
    const targetText = this.extractTargetText(message);

    // Determine requirements
    const requirements = this.extractRequirements(message);

    // Assess complexity
    const complexity = this.assessComplexity(message, targetText);

    return {
      taskType,
      textType,
      targetText,
      requirements,
      complexity
    };
  }

  private suggestWritingActions(message: string, userIntent: any, writingAnalysis: any): any[] {
    const actions = [];

    switch (writingAnalysis.taskType) {
      case 'improvement':
        actions.push({
          type: 'improve_text',
          data: {
            text: writingAnalysis.targetText,
            improvements: writingAnalysis.requirements,
            style: this.detectPreferredStyle(message),
            target_audience: this.detectTargetAudience(message)
          },
          message: 'Improve the provided text',
          priority: 'high'
        });
        break;

      case 'editing':
        actions.push({
          type: 'check_grammar',
          data: {
            text: writingAnalysis.targetText,
            check_type: 'comprehensive'
          },
          message: 'Check grammar and style',
          priority: 'high'
        });
        break;

      case 'translation':
        const targetLanguage = this.extractTargetLanguage(message);
        actions.push({
          type: 'translate_text',
          data: {
            text: writingAnalysis.targetText,
            target_language: targetLanguage,
            preserve_tone: true
          },
          message: `Translate to ${targetLanguage}`,
          priority: 'high'
        });
        break;

      case 'summarization':
        actions.push({
          type: 'summarize_text',
          data: {
            text: writingAnalysis.targetText,
            length: this.extractSummaryLength(message),
            style: 'bullet_points'
          },
          message: 'Create a summary',
          priority: 'medium'
        });
        break;

      case 'creation':
        actions.push({
          type: 'create_content',
          data: {
            content_type: writingAnalysis.textType,
            topic: this.extractTopic(message),
            requirements: writingAnalysis.requirements,
            tone: this.detectPreferredStyle(message),
            length: this.extractTargetLength(message)
          },
          message: 'Create new content',
          priority: 'high'
        });
        break;
    }

    // Add tone adjustment if specified
    if (message.includes('tone') || message.includes('style')) {
      actions.push({
        type: 'adjust_tone',
        data: {
          text: writingAnalysis.targetText,
          target_tone: this.extractTargetTone(message),
          maintain_meaning: true
        },
        message: 'Adjust tone and style',
        priority: 'medium'
      });
    }

    // Add keyword extraction for content analysis
    if (writingAnalysis.targetText && writingAnalysis.targetText.length > 100) {
      actions.push({
        type: 'extract_keywords',
        data: {
          text: writingAnalysis.targetText,
          max_keywords: 10
        },
        message: 'Extract key terms',
        priority: 'low'
      });
    }

    return actions;
  }

  private generateImprovementResponse(message: string, analysis: any, mode: ChatMode): string {
    switch (mode) {
      case 'creative':
        return `Let's transform this text into something truly engaging! I'll enhance the ${analysis.textType} content while maintaining your unique voice and adding creative flair.`;
      case 'analytical':
        return `I'll systematically analyze and improve this ${analysis.textType} text, focusing on structure, clarity, and effectiveness. Let me break down the improvements needed.`;
      case 'task-focused':
        return `I'll quickly enhance this ${analysis.textType} content to make it more effective and polished. Here's what I'll improve:`;
      default:
        return `I'll help improve your ${analysis.textType} text to make it clearer, more engaging, and more effective.`;
    }
  }

  private generateCreationResponse(message: string, analysis: any, mode: ChatMode): string {
    switch (mode) {
      case 'creative':
        return `Exciting! Let's create compelling ${analysis.textType} content together. I'll help you craft something that really resonates with your audience.`;
      case 'analytical':
        return `I'll create structured ${analysis.textType} content based on best practices and proven frameworks. Let me analyze the requirements and develop an optimal approach.`;
      case 'task-focused':
        return `I'll create the ${analysis.textType} content you need efficiently and effectively. Let's get this done!`;
      default:
        return `I'll help you create great ${analysis.textType} content that meets your needs.`;
    }
  }

  private generateEditingResponse(message: string, analysis: any, mode: ChatMode): string {
    switch (mode) {
      case 'creative':
        return `Let's polish this ${analysis.textType} to perfection! I'll edit it carefully while preserving your creative vision and enhancing its impact.`;
      case 'analytical':
        return `I'll provide a thorough editorial review of this ${analysis.textType}, checking for grammar, style, structure, and overall effectiveness.`;
      case 'task-focused':
        return `I'll edit this ${analysis.textType} quickly and thoroughly to fix any issues and improve clarity.`;
      default:
        return `I'll edit your ${analysis.textType} to fix any errors and improve its overall quality.`;
    }
  }

  private generateGeneralWritingResponse(message: string, mode: ChatMode): string {
    switch (mode) {
      case 'creative':
        return "I'm here to help with all your writing needs! Whether it's creative storytelling, content creation, or polishing existing text, let's make your words shine.";
      case 'analytical':
        return "I can assist with comprehensive writing analysis, structure optimization, and strategic content development. What specific writing challenge can I help you solve?";
      case 'task-focused':
        return "Ready to help with your writing tasks! I can improve text, check grammar, create content, or handle any other writing needs efficiently.";
      default:
        return "I'm your writing assistant! I can help improve existing text, create new content, check grammar, adjust tone, translate, and much more.";
    }
  }

  private generateWritingFollowUps(taskType: string, analysis: any): string[] {
    const suggestions = [];

    switch (taskType) {
      case 'improvement':
        suggestions.push(
          "Would you like me to adjust the tone or style?",
          "Should I focus on any specific aspects like clarity or engagement?",
          "Do you want me to create multiple versions to choose from?"
        );
        break;
      case 'creation':
        suggestions.push(
          "Would you like me to create an outline first?",
          "Should I research any specific aspects of this topic?",
          "Do you want multiple drafts or variations?"
        );
        break;
      case 'editing':
        suggestions.push(
          "Would you like me to explain the changes I made?",
          "Should I check for any specific style guidelines?",
          "Do you want me to verify any facts or claims?"
        );
        break;
      default:
        suggestions.push(
          "What type of writing project are you working on?",
          "Do you have any specific style or tone preferences?",
          "Would you like help with brainstorming or outlining?"
        );
    }

    return suggestions;
  }

  // Helper methods for text analysis and extraction
  private extractTargetText(message: string): string {
    // Look for text in quotes or after specific keywords
    const patterns = [
      /"([^"]+)"/g,
      /'([^']+)'/g,
      /text:\s*(.+)/i,
      /improve this:\s*(.+)/i,
      /edit this:\s*(.+)/i,
      /translate:\s*(.+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // If no specific text is marked, consider the entire message as potential content
    return message;
  }

  private extractRequirements(message: string): string[] {
    const requirements = [];
    const requirementPatterns = [
      /make it more ([\w\s]+)/gi,
      /needs to be ([\w\s]+)/gi,
      /should be ([\w\s]+)/gi,
      /focus on ([\w\s]+)/gi
    ];

    for (const pattern of requirementPatterns) {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        requirements.push(match[1].trim());
      }
    }

    return requirements;
  }

  private detectPreferredStyle(message: string): string {
    const styles = {
      'formal': ['formal', 'professional', 'business', 'official'],
      'casual': ['casual', 'informal', 'relaxed', 'friendly'],
      'academic': ['academic', 'scholarly', 'research', 'technical'],
      'creative': ['creative', 'artistic', 'expressive', 'imaginative'],
      'persuasive': ['persuasive', 'convincing', 'compelling', 'sales']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [style, keywords] of Object.entries(styles)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return style;
      }
    }

    return 'neutral';
  }

  private detectTargetAudience(message: string): string {
    const audiences = {
      'general': ['general', 'everyone', 'public'],
      'professional': ['colleagues', 'business', 'professionals'],
      'academic': ['students', 'researchers', 'academics'],
      'technical': ['developers', 'engineers', 'technical'],
      'marketing': ['customers', 'clients', 'audience']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [audience, keywords] of Object.entries(audiences)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return audience;
      }
    }

    return 'general';
  }

  private extractTargetLanguage(message: string): string {
    const languages = {
      'spanish': ['spanish', 'español', 'es'],
      'french': ['french', 'français', 'fr'],
      'german': ['german', 'deutsch', 'de'],
      'italian': ['italian', 'italiano', 'it'],
      'portuguese': ['portuguese', 'português', 'pt'],
      'chinese': ['chinese', '中文', 'zh'],
      'japanese': ['japanese', '日本語', 'ja']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [language, keywords] of Object.entries(languages)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return language;
      }
    }

    return 'english';
  }

  private extractSummaryLength(message: string): string {
    if (message.includes('short') || message.includes('brief')) return 'short';
    if (message.includes('detailed') || message.includes('comprehensive')) return 'detailed';
    if (message.includes('bullet') || message.includes('points')) return 'bullet_points';
    return 'medium';
  }

  private extractTopic(message: string): string {
    const topicPatterns = [
      /about (.+)/i,
      /on (.+)/i,
      /regarding (.+)/i,
      /topic:\s*(.+)/i,
      /write.*about (.+)/i
    ];

    for (const pattern of topicPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'general topic';
  }

  private extractTargetLength(message: string): string {
    if (message.includes('short') || message.includes('brief')) return 'short';
    if (message.includes('long') || message.includes('detailed')) return 'long';
    if (message.includes('paragraph')) return 'paragraph';
    if (message.includes('page')) return 'page';
    return 'medium';
  }

  private extractTargetTone(message: string): string {
    const tones = {
      'professional': ['professional', 'business', 'formal'],
      'friendly': ['friendly', 'warm', 'approachable'],
      'enthusiastic': ['enthusiastic', 'excited', 'energetic'],
      'serious': ['serious', 'grave', 'somber'],
      'humorous': ['funny', 'humorous', 'witty'],
      'persuasive': ['persuasive', 'convincing', 'compelling']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [tone, keywords] of Object.entries(tones)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return tone;
      }
    }

    return 'neutral';
  }

  private assessComplexity(message: string, targetText: string): string {
    const textLength = targetText.length;
    const requirementsCount = this.extractRequirements(message).length;
    
    if (textLength > 1000 || requirementsCount > 3) return 'complex';
    if (textLength > 300 || requirementsCount > 1) return 'moderate';
    return 'simple';
  }
}