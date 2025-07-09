
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
    let activityContext = "";

    // Retrieve relevant data using RAG if enabled
    if (useRAG) {
      console.log('Retrieving user data for RAG...');
      
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

      // Get user activities for comprehensive context
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activitiesError) {
        console.error('Error retrieving activities:', activitiesError);
      } else if (activities && activities.length > 0) {
        console.log(`Found ${activities.length} recent activities for context`);
        
        // Format activities for context, especially deleted items
        const activitySummary = activities.map(activity => {
          const date = new Date(activity.created_at).toLocaleDateString('en-US', { 
            weekday: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          let description = activity.activity_title;
          if (activity.metadata && typeof activity.metadata === 'object') {
            const metadata = activity.metadata as any;
            if (activity.activity_type.includes('deleted') && metadata.title) {
              description += ` (was titled: "${metadata.title}")`;
            }
          }
          
          return `• ${description} - ${date}`;
        }).join('\n');
        
        activityContext = `Recent User Activities:\n${activitySummary}`;
      }

      // Get calendar events
      const { data: events, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('start_date', { ascending: false })
        .limit(10);

      if (eventsError) {
        console.error('Error retrieving events:', eventsError);
      } else if (events && events.length > 0) {
        console.log(`Found ${events.length} recent events`);
        
        const eventsSummary = events.map(event => {
          const date = new Date(event.start_date).toLocaleDateString();
          return `• ${event.title} - ${date}${event.location ? ` at ${event.location}` : ''}`;
        }).join('\n');
        
        if (activityContext) {
          activityContext += `\n\nRecent Calendar Events:\n${eventsSummary}`;
        } else {
          activityContext = `Recent Calendar Events:\n${eventsSummary}`;
        }
      }
    }

    // Prepare the enhanced system message with RAG context
    let systemMessage = `You are a helpful AI assistant with comprehensive access to the user's personal data including notes, calendar events, and activity history. You can provide detailed, contextual responses about their content and actions.

Key capabilities:
- Answer questions about existing notes, including content and metadata
- Provide information about deleted items and when they were removed
- Reference calendar events and scheduling information
- Track user activities and provide historical context
- Help locate content across the user's entire data collection`;
    
    if (ragContext) {
      systemMessage += `\n\nRelevant notes from the user's collection:\n\n${ragContext}`;
    }
    
    if (activityContext) {
      systemMessage += `\n\n${activityContext}`;
    }
    
    if (ragContext || activityContext) {
      systemMessage += `\n\nUse this information to provide accurate, helpful responses. When users ask about missing content, check the activity history for deletion records and provide specific details including when items were deleted.`;
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
