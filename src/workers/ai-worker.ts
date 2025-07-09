/**
 * AI Processing Worker
 * Handles CPU-intensive AI operations in a separate thread
 */

import type { ChatMessage } from '@/hooks/useAIChat';

// Worker interface for AI processing
export interface AIWorkerTask {
  type: 'chat' | 'enhanced-chat' | 'rag-chat' | 'auto-tagging';
  payload: any;
}

export interface AIWorkerResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Main worker function that handles all AI processing tasks
export default async function aiWorker(task: AIWorkerTask): Promise<AIWorkerResult> {
  try {
    console.log(`[AI Worker] Processing task: ${task.type}`);
    
    switch (task.type) {
      case 'chat':
        return await processChat(task.payload);
      case 'enhanced-chat':
        return await processEnhancedChat(task.payload);
      case 'rag-chat':
        return await processRAGChat(task.payload);
      case 'auto-tagging':
        return await processAutoTagging(task.payload);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  } catch (error) {
    console.error('[AI Worker] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function processChat(payload: {
  messages: ChatMessage[];
  model: string;
}): Promise<AIWorkerResult> {
  const { messages, model } = payload;
  
  // Convert messages to OpenAI format
  const openAIMessages = messages.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content
  }));

  // Since we're in a worker, we can't use the Supabase client directly
  // We'll need to make the API call through the main thread
  return {
    success: true,
    data: {
      processedMessages: openAIMessages,
      model,
      timestamp: Date.now()
    }
  };
}

async function processEnhancedChat(payload: {
  messages: ChatMessage[];
  model: string;
  responseFormat?: any;
}): Promise<AIWorkerResult> {
  const { messages, model, responseFormat } = payload;
  
  const openAIMessages = messages.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content
  }));

  const requestBody: any = { 
    messages: openAIMessages,
    model
  };

  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }

  return {
    success: true,
    data: {
      requestBody,
      timestamp: Date.now()
    }
  };
}

async function processRAGChat(payload: {
  messages: ChatMessage[];
  model: string;
  useRAG: boolean;
  searchQuery?: string;
}): Promise<AIWorkerResult> {
  const { messages, model, useRAG, searchQuery } = payload;
  
  const openAIMessages = messages.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content
  }));

  return {
    success: true,
    data: {
      messages: openAIMessages,
      model,
      useRAG,
      searchQuery,
      timestamp: Date.now()
    }
  };
}

async function processAutoTagging(payload: {
  title: string;
  content: string;
}): Promise<AIWorkerResult> {
  const { title, content } = payload;
  
  // Perform CPU-intensive text analysis in worker
  const analysisResult = await analyzeTextForTags(title, content);
  
  return {
    success: true,
    data: {
      requestBody: { title, content },
      analysis: analysisResult,
      timestamp: Date.now()
    }
  };
}

// CPU-intensive text analysis that can benefit from worker thread
async function analyzeTextForTags(title: string, content: string): Promise<{
  wordCount: number;
  keyPhrases: string[];
  contentType: string;
  complexity: number;
}> {
  const combinedText = `${title} ${content}`.toLowerCase();
  const words = combinedText.split(/\s+/).filter(word => word.length > 2);
  
  // Simulate CPU-intensive analysis
  const wordFrequency: Record<string, number> = {};
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  }
  
  // Extract key phrases (this could be much more sophisticated)
  const keyPhrases = Object.entries(wordFrequency)
    .filter(([word, freq]) => freq > 1 && word.length > 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  // Determine content type based on keywords
  let contentType = 'general';
  if (combinedText.includes('code') || combinedText.includes('function') || combinedText.includes('algorithm')) {
    contentType = 'technical';
  } else if (combinedText.includes('meeting') || combinedText.includes('agenda') || combinedText.includes('action')) {
    contentType = 'business';
  } else if (combinedText.includes('idea') || combinedText.includes('creative') || combinedText.includes('design')) {
    contentType = 'creative';
  }
  
  // Calculate complexity score
  const complexity = Math.min(100, Math.round((words.length / 10) + (keyPhrases.length * 2)));
  
  return {
    wordCount: words.length,
    keyPhrases,
    contentType,
    complexity
  };
}