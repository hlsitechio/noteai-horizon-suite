import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

interface SemanticMemory {
  content: string;
  summary: string;
  similarity: number;
  importance_score: number;
  tags: string[];
}

interface SimilarMessage {
  content: string;
  role: string;
  similarity: number;
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, systemPrompt } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Processing message for user:', user.id);

    // Generate embedding for the user message
    const embedding = await generateEmbedding(message);
    
    // Search for similar past conversations
    const { data: similarMessages } = await supabaseClient
      .rpc('search_similar_messages', {
        query_embedding: embedding,
        user_uuid: user.id,
        similarity_threshold: 0.6,
        match_count: 5
      });

    // Search semantic memory for relevant context
    const { data: semanticMemory } = await supabaseClient
      .rpc('search_semantic_memory', {
        query_embedding: embedding,
        user_uuid: user.id,
        similarity_threshold: 0.6,
        match_count: 3
      });

    // Get recent chat history if sessionId provided
    let recentMessages: ChatMessage[] = [];
    if (sessionId) {
      const { data: sessionMessages } = await supabaseClient
        .rpc('get_chat_context', {
          session_uuid: sessionId,
          user_uuid: user.id,
          message_limit: 10
        });
      
      recentMessages = sessionMessages || [];
    }

    // Create or get chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + '...',
          metadata: { auto_generated: true }
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw new Error('Failed to create chat session');
      }

      currentSessionId = newSession.id;
    }

    // Store user message
    const { error: messageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        role: 'user',
        content: message,
        embedding: embedding
      });

    if (messageError) {
      console.error('Error storing message:', messageError);
      throw new Error('Failed to store message');
    }

    // Build context for LLM
    const contextMessages = buildContextMessages(
      message,
      recentMessages,
      similarMessages || [],
      semanticMemory || [],
      systemPrompt
    );

    console.log('Sending to OpenAI with context messages:', contextMessages.length);

    // Get response from OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    // Generate embedding for assistant response
    const assistantEmbedding = await generateEmbedding(assistantMessage);

    // Store assistant response
    const { data: assistantRecord, error: assistantError } = await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        role: 'assistant',
        content: assistantMessage,
        embedding: assistantEmbedding,
        tokens_used: tokensUsed,
        model_used: 'gpt-4.1-2025-04-14'
      })
      .select()
      .single();

    if (assistantError) {
      console.error('Error storing assistant message:', assistantError);
      throw new Error('Failed to store assistant response');
    }

    // Update semantic memory if this is an important conversation
    await updateSemanticMemory(supabaseClient, user.id, message, assistantMessage, embedding);

    // Update session title if it's auto-generated
    if (sessionId) {
      await supabaseClient
        .from('chat_sessions')
        .update({ 
          title: generateSessionTitle(message),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSessionId)
        .eq('user_id', user.id);
    }

    return new Response(JSON.stringify({
      message: assistantMessage,
      sessionId: currentSessionId,
      tokensUsed: tokensUsed,
      contextUsed: {
        similarMessages: similarMessages?.length || 0,
        semanticMemory: semanticMemory?.length || 0,
        recentMessages: recentMessages.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in semantic chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function buildContextMessages(
  userMessage: string,
  recentMessages: ChatMessage[],
  similarMessages: SimilarMessage[],
  semanticMemory: SemanticMemory[],
  systemPrompt?: string
): any[] {
  const messages = [];

  // System prompt
  let contextualPrompt = systemPrompt || 
    "You are a helpful AI assistant with access to the user's conversation history and relevant context.";

  // Add semantic memory context
  if (semanticMemory.length > 0) {
    contextualPrompt += "\n\nRelevant context from previous conversations:\n";
    semanticMemory.forEach((memory, index) => {
      contextualPrompt += `${index + 1}. ${memory.summary || memory.content}\n`;
    });
  }

  // Add similar conversations context
  if (similarMessages.length > 0) {
    contextualPrompt += "\n\nSimilar past conversations:\n";
    similarMessages.forEach((msg, index) => {
      contextualPrompt += `${index + 1}. ${msg.role}: ${msg.content.substring(0, 200)}...\n`;
    });
  }

  messages.push({
    role: 'system',
    content: contextualPrompt
  });

  // Add recent conversation history
  recentMessages
    .slice(-8) // Last 8 messages for context
    .reverse()
    .forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage
  });

  return messages;
}

async function updateSemanticMemory(
  supabaseClient: any,
  userId: string,
  userMessage: string,
  assistantMessage: string,
  embedding: number[]
): Promise<void> {
  // Create a conversation summary for semantic memory
  const conversationContent = `User: ${userMessage}\nAssistant: ${assistantMessage}`;
  
  // Simple importance scoring based on message length and keywords
  const importanceScore = calculateImportanceScore(userMessage, assistantMessage);
  
  if (importanceScore > 0.6) {
    const summary = generateConversationSummary(userMessage, assistantMessage);
    const tags = extractTags(userMessage, assistantMessage);
    
    try {
      await supabaseClient
        .from('semantic_memory')
        .insert({
          user_id: userId,
          content: conversationContent,
          summary: summary,
          embedding: embedding,
          importance_score: importanceScore,
          tags: tags
        });
      
      console.log('Updated semantic memory with importance score:', importanceScore);
    } catch (error) {
      console.error('Error updating semantic memory:', error);
    }
  }
}

function calculateImportanceScore(userMessage: string, assistantMessage: string): number {
  let score = 0.5; // Base score
  
  const combined = userMessage + ' ' + assistantMessage;
  const wordCount = combined.split(' ').length;
  
  // Longer conversations tend to be more important
  if (wordCount > 100) score += 0.2;
  if (wordCount > 200) score += 0.1;
  
  // Check for important keywords
  const importantKeywords = [
    'remember', 'important', 'project', 'deadline', 'meeting', 'task',
    'goal', 'plan', 'decision', 'idea', 'problem', 'solution'
  ];
  
  importantKeywords.forEach(keyword => {
    if (combined.toLowerCase().includes(keyword)) {
      score += 0.05;
    }
  });
  
  return Math.min(score, 1.0);
}

function generateConversationSummary(userMessage: string, assistantMessage: string): string {
  // Simple extractive summary - in production, you might use another LLM call
  const userPreview = userMessage.length > 100 ? 
    userMessage.substring(0, 100) + '...' : userMessage;
  const assistantPreview = assistantMessage.length > 100 ? 
    assistantMessage.substring(0, 100) + '...' : assistantMessage;
  
  return `User asked about: ${userPreview}. Assistant responded: ${assistantPreview}`;
}

function extractTags(userMessage: string, assistantMessage: string): string[] {
  const combined = userMessage + ' ' + assistantMessage;
  const words = combined.toLowerCase().split(/\W+/);
  
  // Extract potential tags based on common topics
  const tagKeywords = {
    'work': ['work', 'job', 'office', 'meeting', 'project', 'deadline'],
    'personal': ['personal', 'family', 'friend', 'hobby', 'vacation'],
    'tech': ['technology', 'software', 'programming', 'computer', 'app'],
    'learning': ['learn', 'study', 'education', 'course', 'tutorial'],
    'health': ['health', 'exercise', 'doctor', 'medical', 'wellness'],
    'finance': ['money', 'budget', 'investment', 'financial', 'bank']
  };
  
  const tags: string[] = [];
  
  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => words.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return tags;
}

function generateSessionTitle(message: string): string {
  // Generate a meaningful title from the first message
  const words = message.split(' ').slice(0, 8).join(' ');
  return words.length > 50 ? words.substring(0, 50) + '...' : words;
}