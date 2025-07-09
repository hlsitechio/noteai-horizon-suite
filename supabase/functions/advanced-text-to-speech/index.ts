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
    const { 
      text, 
      voice = 'alloy', 
      speed = 1.0, 
      pitch = 0, 
      volume = 1.0, 
      format = 'mp3',
      enhance_quality = false 
    } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Generating advanced speech with settings:', { 
      voice, speed, pitch, volume, format, textLength: text.length 
    });

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const finalVoice = validVoices.includes(voice) ? voice : 'alloy';

    // Validate and clamp speed (0.25 to 4.0)
    const finalSpeed = Math.max(0.25, Math.min(4.0, speed));

    // Select model based on quality preference
    const model = enhance_quality ? 'tts-1-hd' : 'tts-1';

    // Generate speech using OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice: finalVoice,
        speed: finalSpeed,
        response_format: format === 'wav' ? 'wav' : 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TTS API error: ${error}`);
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();
    let processedAudioBuffer = audioBuffer;

    // Apply post-processing effects if needed (pitch, volume)
    if (pitch !== 0 || volume !== 1.0) {
      console.log('Applying audio post-processing...');
      
      // For pitch and volume adjustments, we would typically need 
      // a more sophisticated audio processing library
      // For now, we'll apply basic volume scaling if needed
      
      if (volume !== 1.0 && volume > 0) {
        // Basic volume adjustment (simplified)
        const audioData = new Uint8Array(audioBuffer);
        const scaledData = new Uint8Array(audioData.length);
        
        // Note: This is a very basic volume scaling
        // Real implementation would need proper audio processing
        const volumeScale = Math.max(0.1, Math.min(2.0, volume));
        
        for (let i = 0; i < audioData.length; i++) {
          let sample = (audioData[i] - 128) * volumeScale;
          sample = Math.max(-128, Math.min(127, sample));
          scaledData[i] = sample + 128;
        }
        
        processedAudioBuffer = scaledData.buffer;
      }
    }

    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(processedAudioBuffer))
    );

    // Calculate approximate duration (rough estimation)
    const wordsPerMinute = 150; // Average speaking rate
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / wordsPerMinute) * 60 / finalSpeed;

    const result = {
      audioContent: base64Audio,
      format,
      voice: finalVoice,
      speed: finalSpeed,
      pitch,
      volume,
      duration: Math.round(estimatedDuration),
      wordCount,
      byteSize: processedAudioBuffer.byteLength
    };

    console.log('Advanced TTS generation complete:', {
      format: result.format,
      voice: result.voice,
      duration: result.duration,
      byteSize: result.byteSize
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advanced text-to-speech:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      audioContent: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});