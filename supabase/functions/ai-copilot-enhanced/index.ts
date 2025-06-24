
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

// Enhanced model selection based on task requirements
function selectOptimalModel(action: string, textLength: number, hasContext: boolean): string {
  switch (action) {
    case 'improve':
    case 'simplify':
      // Use best reasoning model for improvement tasks
      return 'deepseek/r1-distill-qwen-14b';
    
    case 'translate':
      // Use multilingual model for translation
      return 'sarvamai/sarvam-m';
    
    case 'summarize':
      // Use efficient model for summarization
      return textLength > 1000 ? 'google/gemma-3-4b' : 'mistralai/mistral-small-3';
    
    case 'expand':
      // Use creative model for expansion
      return 'arliai/qwq-32b-rpr-v1';
    
    case 'custom':
      // Use premium model for custom tasks
      return hasContext ? 'deepseek/r1-distill-qwen-14b' : 'featherless/qwerky-72b';
    
    default:
      // Default to best overall model
      return 'deepseek/r1-distill-qwen-14b';
  }
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

    // Select optimal model based on task
    const model = selectOptimalModel(action, text.length, similarNotes.length > 0);

    // Generate AI prompt based on action with enhanced instructions
    let systemPrompt = '';
    let userPrompt = '';
    let temperature = 0.7;

    switch (action) {
      case 'improve':
        systemPrompt = 'You are a professional writing coach with expertise in clarity, engagement, and impact. Enhance the text by improving word choice, sentence structure, and overall flow while preserving the original voice and meaning. Focus on making the writing more compelling and professional.';
        userPrompt = `Please improve this text by enhancing clarity, engagement, and professional impact:\n\n${text}${contextFromNotes}`;
        temperature = 0.5;
        break;
        
      case 'translate':
        const languageMap: Record<string, string> = {
          'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
          'pt': 'Portuguese', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean',
          'ar': 'Arabic', 'ru': 'Russian'
        };
        const targetLang = languageMap[targetLanguage || 'es'] || 'Spanish';
        systemPrompt = `You are a professional translator with native-level fluency. Translate the text to ${targetLang} while maintaining nuance, cultural context, and the original tone. Ensure the translation reads naturally to native speakers.`;
        userPrompt = `Please translate this text to ${targetLang} with cultural sensitivity and natural flow:\n\n${text}`;
        temperature = 0.3;
        break;
        
      case 'summarize':
        systemPrompt = 'You are an expert at distilling complex information into clear, actionable summaries. Create concise summaries that capture the essential points, key insights, and main takeaways while maintaining logical flow.';
        userPrompt = `Please create a comprehensive yet concise summary of this text, highlighting key insights:\n\n${text}${contextFromNotes}`;
        temperature = 0.4;
        break;
        
      case 'expand':
        systemPrompt = 'You are a skilled content developer who excels at adding depth, examples, and context. Expand the text by providing relevant details, supporting arguments, real-world examples, and deeper analysis while maintaining coherence.';
        userPrompt = `Please expand this text with additional depth, examples, and supporting context:\n\n${text}${contextFromNotes}`;
        temperature = 0.6;
        break;
        
      case 'simplify':
        systemPrompt = 'You are an expert at making complex information accessible. Simplify the text by using clearer vocabulary, shorter sentences, and more straightforward explanations while preserving all important information.';
        userPrompt = `Please simplify this text for better readability and accessibility:\n\n${text}`;
        temperature = 0.4;
        break;
        
      case 'custom':
        systemPrompt = 'You are a versatile AI assistant with expertise across multiple domains. Follow the user\'s specific instructions carefully while applying best practices for the requested task.';
        userPrompt = `${customPrompt}\n\nText to work with:\n${text}${contextFromNotes}`;
        temperature = 0.6;
        break;
    }

    // Call OpenRouter API with enhanced configuration
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': supabaseUrl,
        'X-Title': 'AI Note Copilot Enhanced'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: action === 'expand' ? 3000 : action === 'summarize' ? 1000 : 2000,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
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

    // Create or update copilot session with enhanced metadata
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
        similarNotesCount: similarNotes.length,
        textLength: text.length,
        processingTime,
        temperature,
        quality_score: Math.min(100, Math.max(0, 100 - (processingTime / 1000) * 10)) // Simple quality metric
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

    // Track usage with enhanced metrics
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
