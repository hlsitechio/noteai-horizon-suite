import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface UserContext {
  display_name: string;
  email: string;
  preferences?: Record<string, any>;
  recent_activity?: string[];
}

interface ChatRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
  model?: string;
  response_format?: any;
  include_user_context?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      messages, 
      model = "deepseek/deepseek-chat-v3-0324:free", 
      response_format,
      include_user_context = true
    }: ChatRequest = await req.json();

    console.log('AI Chat request received:', { 
      messagesCount: messages.length, 
      model,
      hasStructuredOutput: !!response_format,
      includeUserContext: include_user_context
    });

    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    let userContext: UserContext | null = null;

    // Get user context if requested
    if (include_user_context) {
      try {
        // Initialize Supabase client
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: req.headers.get('Authorization')! },
            },
          }
        );

        // Get the authenticated user
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        
        if (user && !authError) {
          console.log('Fetching user context for:', user.id);

          // Fetch user profile
          const { data: profile, error: profileError } = await supabaseClient
            .from('user_profiles')
            .select('display_name, email')
            .eq('id', user.id)
            .single();

          if (profile && !profileError) {
            userContext = {
              display_name: profile.display_name,
              email: profile.email,
              preferences: {},
              recent_activity: []
            };
            console.log('User context loaded:', userContext.display_name);
          } else {
            console.log('No user profile found, using basic context');
            userContext = {
              display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              preferences: {},
              recent_activity: []
            };
          }
        }
      } catch (contextError) {
        console.warn('Failed to load user context:', contextError);
        // Continue without user context
      }
    }

    // Enhance the system message with user context
    const enhancedMessages = [...messages];
    
    // Find or create system message
    let systemMessageIndex = enhancedMessages.findIndex(msg => msg.role === 'system');
    
    let systemContent = '';
    if (systemMessageIndex >= 0) {
      systemContent = enhancedMessages[systemMessageIndex].content;
    } else {
      systemContent = 'You are a helpful AI assistant for the Online Note AI app. You help users create notes, organize their thoughts, set reminders, and assist with various writing tasks.';
      systemMessageIndex = 0;
      enhancedMessages.unshift({
        role: 'system',
        content: systemContent
      });
    }

    // Add user context to system message
    if (userContext) {
      const userContextPrompt = `

**User Context:**
- User's name: ${userContext.display_name}
- Email: ${userContext.email}

**Important Instructions:**
- Always address the user by their name (${userContext.display_name}) in a natural and friendly way
- Remember their name throughout the conversation
- Personalize your responses based on their identity
- Make the conversation feel warm and personal
- When creating notes or setting reminders, consider using their name when appropriate

**Example greetings:**
- "Hi ${userContext.display_name}! How can I help you today?"
- "Hello ${userContext.display_name}, what would you like to work on?"
- "Good to see you ${userContext.display_name}! What can I assist you with?"

Please be natural and conversational while maintaining professionalism.`;

      enhancedMessages[systemMessageIndex] = {
        role: 'system',
        content: systemContent + userContextPrompt
      };

      console.log('Enhanced system message with user context for:', userContext.display_name);
    }

    console.log('Making request to OpenRouter API...');
    
    const requestBody: any = {
      model,
      messages: enhancedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    // Add structured output format if provided
    if (response_format) {
      requestBody.response_format = response_format;
      console.log('Using structured output with schema');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Online Note AI - Personalized Assistant',
      },
      body: JSON.stringify(requestBody),
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

    console.log('AI Chat response generated successfully');

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content,
      model: data.model || model,
      usage: data.usage,
      structured: !!response_format,
      user_context: userContext ? {
        name: userContext.display_name,
        email: userContext.email
      } : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-with-context function:', error);
    
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