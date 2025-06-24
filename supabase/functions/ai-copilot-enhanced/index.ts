
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CopilotRequest {
  action: 'improve' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'custom';
  text: string;
  noteId?: string;
  targetLanguage?: string;
  customPrompt?: string;
  sessionId?: string;
}

interface CopilotResponse {
  result: string;
  sessionId: string;
  processingTime: number;
  model: string;
  tokensUsed?: number;
  similarNotes?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, text, noteId, targetLanguage, customPrompt, sessionId }: CopilotRequest = await req.json();
    
    const startTime = Date.now();
    
    // Check user's daily AI usage limit
    const { data: canMakeRequest } = await supabase.rpc('can_make_ai_request', {
      user_uuid: user.id
    });

    if (!canMakeRequest) {
      return new Response(JSON.stringify({ 
        error: 'Daily AI usage limit exceeded. Please upgrade your plan or try again tomorrow.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get similar notes for context (using text similarity)
    let similarNotes = [];
    if (noteId && text.length > 20) {
      const { data: notes } = await supabase.rpc('find_similar_notes_text', {
        search_text: text.substring(0, 100), // Use first 100 chars for similarity
        user_uuid: user.id,
        max_results: 3
      });
      
      if (notes) {
        similarNotes = notes.filter((note: any) => note.note_id !== noteId);
      }
    }

    // Build context from similar notes
    const contextFromNotes = similarNotes.length > 0 
      ? `\n\nRelated content from your notes:\n${similarNotes.map((note: any) => 
          `- ${note.title}: ${note.content.substring(0, 200)}...`
        ).join('\n')}`
      : '';

    // Generate AI prompt based on action
    let systemPrompt = '';
    let userPrompt = '';
    let model = 'openai/gpt-4o-mini'; // Default free model

    switch (action) {
      case 'improve':
        systemPrompt = 'You are a professional writing assistant. Improve the given text by enhancing clarity, flow, and impact while maintaining the original meaning and tone.';
        userPrompt = `Please improve this text:\n\n${text}${contextFromNotes}`;
        break;
        
      case 'translate':
        const languageMap: Record<string, string> = {
          'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
          'pt': 'Portuguese', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean',
          'ar': 'Arabic', 'ru': 'Russian'
        };
        const targetLang = languageMap[targetLanguage || 'es'] || 'Spanish';
        systemPrompt = `You are a professional translator. Translate the given text to ${targetLang} while maintaining the original meaning and context.`;
        userPrompt = `Please translate this text to ${targetLang}:\n\n${text}`;
        break;
        
      case 'summarize':
        systemPrompt = 'You are a professional summarizer. Create concise, clear summaries that capture the key points and main ideas.';
        userPrompt = `Please summarize this text:\n\n${text}${contextFromNotes}`;
        break;
        
      case 'expand':
        systemPrompt = 'You are a professional content writer. Expand the given text by adding relevant details, examples, and context while maintaining the original intent.';
        userPrompt = `Please expand this text with more detail and context:\n\n${text}${contextFromNotes}`;
        break;
        
      case 'simplify':
        systemPrompt = 'You are a professional editor. Simplify the given text to make it clearer and more accessible while preserving the essential information.';
        userPrompt = `Please simplify this text:\n\n${text}`;
        break;
        
      case 'custom':
        systemPrompt = 'You are a helpful AI assistant. Follow the user\'s custom instructions carefully.';
        userPrompt = `${customPrompt}\n\nText to work with:\n${text}${contextFromNotes}`;
        model = 'openai/gpt-4o-mini'; // Use better model for custom prompts
        break;
    }

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': supabaseUrl,
        'X-Title': 'AI Note Copilot'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const aiResponse = await openRouterResponse.json();
    const result = aiResponse.choices[0]?.message?.content || 'No response generated';
    const processingTime = Date.now() - startTime;
    const tokensUsed = aiResponse.usage?.total_tokens || 0;

    // Create or update copilot session
    const sessionData = {
      user_id: user.id,
      note_id: noteId || null,
      session_type: action,
      original_content: text,
      processed_content: result,
      model_config: {
        model,
        action,
        targetLanguage,
        customPrompt,
        tokensUsed,
        similarNotesCount: similarNotes.length
      },
      processing_time: processingTime
    };

    let finalSessionId = sessionId;

    if (sessionId) {
      // Update existing session
      await supabase
        .from('ai_copilot_sessions')
        .update(sessionData)
        .eq('id', sessionId)
        .eq('user_id', user.id);
    } else {
      // Create new session
      const { data: newSession } = await supabase
        .from('ai_copilot_sessions')
        .insert([sessionData])
        .select('id')
        .single();
      
      if (newSession) {
        finalSessionId = newSession.id;
      }
    }

    // Track usage
    await supabase.rpc('track_copilot_usage', {
      user_uuid: user.id,
      tokens_used: tokensUsed,
      model_name: model.replace('/', '_')
    });

    const response: CopilotResponse = {
      result,
      sessionId: finalSessionId || '',
      processingTime,
      model,
      tokensUsed,
      similarNotes: similarNotes.map((note: any) => ({
        id: note.note_id,
        title: note.title,
        content: note.content.substring(0, 200) + '...'
      }))
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-copilot-enhanced function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
