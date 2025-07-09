import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, options = {} } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Processing audio with advanced analysis options:', options);

    // Convert base64 to blob for OpenAI
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' });

    // Basic transcription
    const transcriptionForm = new FormData();
    transcriptionForm.append('file', audioBlob, 'audio.webm');
    transcriptionForm.append('model', 'whisper-1');
    transcriptionForm.append('response_format', 'verbose_json');
    transcriptionForm.append('timestamp_granularities[]', 'word');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: transcriptionForm,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription failed: ${await transcriptionResponse.text()}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text;
    const duration = transcriptionData.duration || 0;
    const words = transcriptionData.words || [];

    console.log('Transcription successful:', transcription);

    // Initialize analysis results
    let sentiment = 'neutral';
    let confidence = 0.9;
    let language = 'en';
    let keywords: string[] = [];
    let wordCount = words.length;
    let speakingRate = duration > 0 ? (wordCount / (duration / 60)) : 0;

    // Advanced analysis using GPT if requested
    if (options.analyze_sentiment || options.extract_keywords || options.detect_language) {
      const analysisPrompt = `
Analyze the following transcribed speech and provide a JSON response with the requested analysis:

Text: "${transcription}"

Please provide:
${options.analyze_sentiment ? '- sentiment: "positive", "negative", or "neutral"' : ''}
${options.extract_keywords ? '- keywords: array of 3-5 most important keywords' : ''}
${options.detect_language ? '- language: detected language code (e.g., "en", "es", "fr")' : ''}
- confidence: confidence score from 0 to 1

Return only valid JSON format.
      `;

      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert in speech and text analysis. Always return valid JSON.' },
            { role: 'user', content: analysisPrompt }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (analysisResponse.ok) {
        try {
          const analysisData = await analysisResponse.json();
          const analysisResult = JSON.parse(analysisData.choices[0].message.content);
          
          if (options.analyze_sentiment && analysisResult.sentiment) {
            sentiment = analysisResult.sentiment;
          }
          if (options.extract_keywords && analysisResult.keywords) {
            keywords = analysisResult.keywords;
          }
          if (options.detect_language && analysisResult.language) {
            language = analysisResult.language;
          }
          if (analysisResult.confidence) {
            confidence = analysisResult.confidence;
          }
        } catch (parseError) {
          console.warn('Failed to parse analysis result:', parseError);
        }
      } else {
        console.warn('Analysis request failed:', await analysisResponse.text());
      }
    }

    // Extract basic keywords if not analyzed by GPT
    if (options.extract_keywords && keywords.length === 0) {
      const wordFreq = new Map<string, number>();
      const words = transcription.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their'].includes(word));
      
      words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
      
      keywords = Array.from(wordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
    }

    const result = {
      transcription,
      sentiment,
      confidence,
      language,
      keywords,
      duration,
      word_count: wordCount,
      speaking_rate: Math.round(speakingRate),
      words: words // Include word-level timestamps if available
    };

    console.log('Advanced speech processing complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advanced speech processing:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      transcription: '', // Fallback empty transcription
      sentiment: 'neutral',
      confidence: 0,
      language: 'en',
      keywords: [],
      duration: 0,
      word_count: 0,
      speaking_rate: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});