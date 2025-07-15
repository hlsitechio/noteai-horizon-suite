import { BaseAgent } from '../agents/BaseAgent';
import { ProductivityAgent } from '../agents/ProductivityAgent';
import { WritingAgent } from '../agents/WritingAgent';
import { GeneralAgent } from '../agents/GeneralAgent';
import { AIKnowledgeManager } from './AIKnowledgeManager';
import { 
  AIContext, 
  AIMessage, 
  AgentResponse, 
  ChatMode, 
  UserProfile, 
  UserPreferences,
  TaskContext 
} from '../types';

export class AgentCoordinator {
  private agents: Map<string, BaseAgent>;
  private knowledgeManager: AIKnowledgeManager;
  private currentContext: AIContext;
  private activeAgent: BaseAgent;

  constructor() {
    this.agents = new Map();
    this.knowledgeManager = new AIKnowledgeManager();
    
    // Initialize agents
    this.initializeAgents();
    
    // Set default active agent
    this.activeAgent = this.agents.get('general-agent')!;
    
    // Initialize context
    this.currentContext = this.initializeContext();
  }

  private initializeAgents(): void {
    const productivityAgent = new ProductivityAgent();
    const writingAgent = new WritingAgent();
    const generalAgent = new GeneralAgent();

    this.agents.set(productivityAgent.getAgent().id, productivityAgent);
    this.agents.set(writingAgent.getAgent().id, writingAgent);
    this.agents.set(generalAgent.getAgent().id, generalAgent);
  }

  private initializeContext(): AIContext {
    return {
      sessionId: `session-${Date.now()}`,
      conversationHistory: [],
      sharedKnowledge: this.knowledgeManager.getSharedKnowledge()
    };
  }

  public async processMessage(
    message: string,
    mode: ChatMode = 'general',
    userProfile?: UserProfile,
    taskContext?: TaskContext
  ): Promise<AgentResponse> {
    // Update context
    this.updateContext(message, userProfile, taskContext);
    
    // Create user message
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // Add to conversation history
    this.currentContext.conversationHistory.push(userMessage);

    // Determine the best agent for this message
    const bestAgent = await this.selectBestAgent(message, mode);
    
    // Set context for the selected agent
    bestAgent.setContext(this.currentContext);
    
    // Process the message
    const response = await bestAgent.processMessage(message, mode);
    
    // Create assistant message
    const assistantMessage: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      agentId: bestAgent.getAgent().id,
      metadata: {
        actions: response.actions,
        confidence: response.confidence,
        reasoning: response.reasoning
      }
    };

    // Add to conversation history
    this.currentContext.conversationHistory.push(assistantMessage);

    // Update knowledge with any actions
    if (response.actions) {
      response.actions.forEach(action => {
        this.knowledgeManager.addRecentAction(action);
      });
    }

    // Learn from the interaction
    this.learnFromInteraction(userMessage, assistantMessage, response);

    return response;
  }

  private async selectBestAgent(message: string, mode: ChatMode): Promise<BaseAgent> {
    // First, let the general agent analyze if delegation is needed
    const generalAgent = this.agents.get('general-agent')!;
    generalAgent.setContext(this.currentContext);
    
    const generalResponse = await generalAgent.processMessage(message, mode);
    
    // Check if general agent suggests delegation
    if (generalResponse.actions) {
      const delegationAction = generalResponse.actions.find(action => action.type === 'delegate_to_agent');
      if (delegationAction) {
        const recommendedAgent = this.agents.get(delegationAction.data.agent_id);
        if (recommendedAgent) {
          this.activeAgent = recommendedAgent;
          return recommendedAgent;
        }
      }
    }

    // If no specific delegation or agent not found, use current active agent
    return this.activeAgent;
  }

  public switchAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.activeAgent = agent;
      return true;
    }
    return false;
  }

  public getAvailableAgents(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.agents.values()).map(agent => {
      const agentData = agent.getAgent();
      return {
        id: agentData.id,
        name: agentData.name,
        description: agentData.description
      };
    });
  }

  public getCurrentAgent(): { id: string; name: string } {
    const agentData = this.activeAgent.getAgent();
    return {
      id: agentData.id,
      name: agentData.name
    };
  }

  public updateUserPreferences(preferences: Partial<UserPreferences>): void {
    this.knowledgeManager.updateUserPreferences(preferences);
    this.currentContext.sharedKnowledge = this.knowledgeManager.getSharedKnowledge();
    this.currentContext.preferences = this.currentContext.sharedKnowledge.preferences;
  }

  public setUserProfile(profile: UserProfile): void {
    this.currentContext.userProfile = profile;
  }

  public setTaskContext(taskContext: TaskContext): void {
    this.currentContext.currentTask = taskContext;
  }

  public getConversationHistory(): AIMessage[] {
    return [...this.currentContext.conversationHistory];
  }

  public clearConversationHistory(): void {
    this.currentContext.conversationHistory = [];
  }

  public restoreConversationHistory(messages: AIMessage[]): void {
    this.currentContext.conversationHistory = [...messages];
  }

  public getSharedKnowledge() {
    return this.knowledgeManager.getSharedKnowledge();
  }

  public searchKnowledge(query: string, filters?: { tags?: string[]; category?: string }) {
    return this.knowledgeManager.searchNotes(query, filters?.tags, filters?.category);
  }

  public addNote(title: string, content: string, tags: string[] = [], category?: string) {
    const note = {
      id: `note-${Date.now()}`,
      title,
      content,
      tags,
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.knowledgeManager.addNote(note);
    this.currentContext.sharedKnowledge = this.knowledgeManager.getSharedKnowledge();
    
    return note;
  }

  public updateNote(noteId: string, updates: { title?: string; content?: string; tags?: string[]; category?: string }) {
    this.knowledgeManager.updateNote(noteId, updates);
    this.currentContext.sharedKnowledge = this.knowledgeManager.getSharedKnowledge();
  }

  public deleteNote(noteId: string) {
    this.knowledgeManager.deleteNote(noteId);
    this.currentContext.sharedKnowledge = this.knowledgeManager.getSharedKnowledge();
  }

  public analyzeUserBehavior() {
    return this.knowledgeManager.analyzeUserBehavior();
  }

  public getRecommendedMode(message: string): ChatMode {
    const behavior = this.knowledgeManager.analyzeUserBehavior();
    const lowerMessage = message.toLowerCase();
    
    // Analyze message characteristics
    const isTask = ['create', 'make', 'do', 'task', 'reminder'].some(word => lowerMessage.includes(word));
    const isCreative = ['creative', 'idea', 'brainstorm', 'imagine'].some(word => lowerMessage.includes(word));
    const isAnalytical = ['analyze', 'compare', 'research', 'data'].some(word => lowerMessage.includes(word));
    const isQuestion = ['what', 'how', 'why', 'when', 'where'].some(word => lowerMessage.includes(word));
    
    // Consider user preferences
    const preferences = this.currentContext.preferences;
    
    if (isTask && preferences?.taskManagementStyle === 'structured') return 'task-focused';
    if (isCreative || preferences?.aiPersonality === 'creative') return 'creative';
    if (isAnalytical || preferences?.aiPersonality === 'analytical') return 'analytical';
    if (isQuestion && preferences?.communicationStyle === 'detailed') return 'analytical';
    
    // Consider current context
    if (this.currentContext.currentTask?.type === 'productivity') return 'task-focused';
    if (this.currentContext.currentTask?.type === 'creative') return 'creative';
    if (this.currentContext.currentTask?.type === 'analysis') return 'analytical';
    
    return 'general';
  }

  private updateContext(message: string, userProfile?: UserProfile, taskContext?: TaskContext): void {
    if (userProfile) {
      this.currentContext.userProfile = userProfile;
    }
    
    if (taskContext) {
      this.currentContext.currentTask = taskContext;
    }
    
    // Update shared knowledge
    this.currentContext.sharedKnowledge = this.knowledgeManager.getSharedKnowledge();
    this.currentContext.preferences = this.currentContext.sharedKnowledge.preferences;
    
    // Trim conversation history if it gets too long
    if (this.currentContext.conversationHistory.length > 20) {
      this.currentContext.conversationHistory = this.currentContext.conversationHistory.slice(-15);
    }
  }

  private learnFromInteraction(
    userMessage: AIMessage, 
    assistantMessage: AIMessage, 
    response: AgentResponse
  ): void {
    // Create contextual memory from the interaction
    const memory = {
      id: `interaction-${Date.now()}`,
      context: `User: ${userMessage.content.substring(0, 100)}... | Assistant: ${assistantMessage.content.substring(0, 100)}...`,
      insights: [
        `Agent used: ${assistantMessage.agentId}`,
        `Confidence: ${response.confidence}`,
        `Actions taken: ${response.actions?.length || 0}`
      ],
      importance: response.confidence,
      timestamp: new Date(),
      relatedTopics: this.extractTopics(userMessage.content)
    };
    
    this.knowledgeManager.addContextualMemory(memory);
  }

  private extractTopics(message: string): string[] {
    // Simple topic extraction - could be enhanced with NLP
    const words = message.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'you', 'me', 'my', 'your'];
    const topics = words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
      .slice(0, 5); // Limit to 5 topics
    
    return topics;
  }
}