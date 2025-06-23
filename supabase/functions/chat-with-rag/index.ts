
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { messages, model = "deepseek/deepseek-r1-0528:free", useRAG = true, searchQuery = "" } = await req.json();

    console.log('RAG-enhanced chat request received:', { 
      messagesCount: messages.length, 
      model,
      useRAG,
      userId: user.id 
    });

    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    let ragContext = "";
    let relevantNotes = [];

    // Retrieve relevant notes using RAG if enabled
    if (useRAG) {
      console.log('Retrieving user notes for RAG...');
      
      // Get the last user message to use as search query if no specific query provided
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const actualSearchQuery = searchQuery || (lastUserMessage?.content || "");
      
      // Search for relevant notes
      const { data: notes, error: notesError } = await supabase.rpc('search_user_notes_for_rag', {
        user_uuid: user.id,
        search_query: actualSearchQuery.slice(0, 100), // Limit search query length
        limit_count: 5
      });

      if (notesError) {
        console.error('Error retrieving notes:', notesError);
      } else if (notes && notes.length > 0) {
        relevantNotes = notes;
        console.log(`Found ${notes.length} relevant notes for RAG`);
        
        // Format notes for context
        ragContext = notes.map(note => {
          const tagsStr = note.tags && note.tags.length > 0 ? ` [Tags: ${note.tags.join(', ')}]` : '';
          const dateStr = new Date(note.updated_at).toLocaleDateString();
          return `**${note.title}** (${dateStr})${tagsStr}\n${note.content.slice(0, 500)}${note.content.length > 500 ? '...' : ''}`;
        }).join('\n\n---\n\n');
      }
    }

    // Prepare the enhanced system message with RAG context
    let systemMessage = `You are a helpful AI assistant. You have access to the user's personal notes and can reference them to provide more personalized and contextual responses.`;
    
    if (ragContext) {
      systemMessage += `\n\nRelevant notes from the user's collection:\n\n${ragContext}\n\nUse this information to provide more helpful and personalized responses. Reference specific notes when relevant, but don't feel obligated to use all the information if it's not pertinent to the user's question.`;
    }

    // Prepare messages for OpenRouter
    const enhancedMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    console.log('Making request to OpenRouter API with RAG context...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Lovable Notes App with RAG',
      },
      body: JSON.stringify({
        model,
        messages: enhancedMessages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', { 
        status: response.status, 
        statusText: response.statusText,
        errorText 
      });
      
      if (response.status === 401) {
        throw new Error('Invalid API key or unauthorized access');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits or payment required');
      } else {
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('OpenRouter API response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from OpenRouter:', data);
      throw new Error('Invalid response from OpenRouter API');
    }

    // Track RAG usage
    if (useRAG && relevantNotes.length > 0) {
      await supabase.from('ai_usage_tracking').insert({
        user_id: user.id,
        request_type: 'rag_enhanced_chat',
        tokens_used: data.usage?.total_tokens || 0
      });
    }

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content,
      model: data.model || model,
      usage: data.usage,
      ragEnabled: useRAG,
      notesUsed: relevantNotes.length,
      relevantNotes: relevantNotes.map(note => ({
        id: note.id,
        title: note.title,
        relevanceScore: note.relevance_score
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in RAG-enhanced chat function:', error);
    
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'API key configuration error';
      statusCode = 401;
    } else if (error.message?.includes('Rate limit')) {
      errorMessage = 'Rate limit exceeded';
      statusCode = 429;
    } else if (error.message?.includes('credits') || error.message?.includes('payment')) {
      errorMessage = 'Insufficient credits';
      statusCode = 402;
    } else if (error.message?.includes('Authentication')) {
      errorMessage = 'Authentication failed';
      statusCode = 401;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Please check the function logs for more information'
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
