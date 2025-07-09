import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export interface AudioAnalysis {
  transcription: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  language: string;
  keywords: string[];
  duration: number;
  wordCount: number;
  speakingRate: number; // words per minute
}

export interface VoiceSettings {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number; // 0.25 to 4.0
  pitch: number; // -20 to 20 semitones
  volume: number; // 0 to 1
}

export const useAudioProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AudioAnalysis | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: 'alloy',
    speed: 1.0,
    pitch: 0,
    volume: 1.0
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  }, []);

  // Advanced speech-to-text with analysis
  const transcribeWithAnalysis = useCallback(async (audioBlob: Blob): Promise<AudioAnalysis | null> => {
    setIsProcessing(true);
    
    try {
      console.log('Starting advanced audio analysis...');
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Call advanced speech processing function
      const { data, error } = await supabase.functions.invoke('advanced-speech-processing', {
        body: { 
          audio: base64Audio,
          options: {
            analyze_sentiment: true,
            extract_keywords: true,
            detect_language: true,
            calculate_metrics: true
          }
        }
      });

      if (error) throw error;

      const analysis: AudioAnalysis = {
        transcription: data.transcription,
        sentiment: data.sentiment || 'neutral',
        confidence: data.confidence || 0.9,
        language: data.language || 'en',
        keywords: data.keywords || [],
        duration: data.duration || 0,
        wordCount: data.word_count || 0,
        speakingRate: data.speaking_rate || 0
      };

      setCurrentAnalysis(analysis);
      console.log('Audio analysis complete:', analysis);
      
      return analysis;

    } catch (error: any) {
      console.error('Error in audio analysis:', error);
      toast.error(`Audio analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Advanced text-to-speech with custom voice settings
  const synthesizeSpeech = useCallback(async (
    text: string, 
    settings?: Partial<VoiceSettings>
  ): Promise<string | null> => {
    setIsProcessing(true);
    
    try {
      const finalSettings = { ...voiceSettings, ...settings };
      console.log('Synthesizing speech with settings:', finalSettings);

      const { data, error } = await supabase.functions.invoke('advanced-text-to-speech', {
        body: {
          text,
          voice: finalSettings.voice,
          speed: finalSettings.speed,
          pitch: finalSettings.pitch,
          volume: finalSettings.volume,
          format: 'mp3'
        }
      });

      if (error) throw error;

      if (data.audioContent) {
        // Create audio URL from base64
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Speech synthesis successful');
        return audioUrl;
      }

      throw new Error('No audio content received');

    } catch (error: any) {
      console.error('Error in speech synthesis:', error);
      toast.error(`Speech synthesis failed: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [voiceSettings, toast]);

  // Real-time audio effects processing
  const applyAudioEffects = useCallback(async (
    audioData: Float32Array,
    effects: {
      noiseReduction?: boolean;
      echoCancellation?: boolean;
      volumeBoost?: number;
      equalizerSettings?: { low: number; mid: number; high: number };
    }
  ): Promise<Float32Array> => {
    const audioContext = initAudioContext();
    
    try {
      // Create buffer from audio data
      const buffer = audioContext.createBuffer(1, audioData.length, audioContext.sampleRate);
      buffer.getChannelData(0).set(audioData);
      
      // Apply effects chain
      let sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = buffer;
      
      let currentNode: AudioNode = sourceNode;
      
      // Volume boost
      if (effects.volumeBoost && effects.volumeBoost !== 1) {
        const gainNode = audioContext.createGain();
        gainNode.gain.value = effects.volumeBoost;
        currentNode.connect(gainNode);
        currentNode = gainNode;
      }
      
      // Equalizer
      if (effects.equalizerSettings) {
        const { low, mid, high } = effects.equalizerSettings;
        
        // Low frequency filter
        const lowFilter = audioContext.createBiquadFilter();
        lowFilter.type = 'lowshelf';
        lowFilter.frequency.value = 320;
        lowFilter.gain.value = low;
        
        // Mid frequency filter
        const midFilter = audioContext.createBiquadFilter();
        midFilter.type = 'peaking';
        midFilter.frequency.value = 1000;
        midFilter.gain.value = mid;
        midFilter.Q.value = 0.5;
        
        // High frequency filter
        const highFilter = audioContext.createBiquadFilter();
        highFilter.type = 'highshelf';
        highFilter.frequency.value = 3200;
        highFilter.gain.value = high;
        
        currentNode.connect(lowFilter);
        lowFilter.connect(midFilter);
        midFilter.connect(highFilter);
        currentNode = highFilter;
      }
      
      // Output processing (simplified - in real implementation would use Web Audio API)
      // For now, return the original data with basic volume adjustment
      const processedData = new Float32Array(audioData.length);
      const volumeMultiplier = effects.volumeBoost || 1;
      
      for (let i = 0; i < audioData.length; i++) {
        processedData[i] = Math.max(-1, Math.min(1, audioData[i] * volumeMultiplier));
      }
      
      return processedData;
      
    } catch (error) {
      console.error('Error applying audio effects:', error);
      return audioData; // Return original on error
    }
  }, [initAudioContext]);

  // Audio format conversion utilities
  const convertAudioFormat = useCallback(async (
    audioBlob: Blob,
    targetFormat: 'wav' | 'mp3' | 'ogg' | 'webm'
  ): Promise<Blob | null> => {
    try {
      setIsProcessing(true);
      
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const { data, error } = await supabase.functions.invoke('audio-format-converter', {
        body: { 
          audio: base64Audio,
          source_format: audioBlob.type.split('/')[1],
          target_format: targetFormat,
          quality: 'high'
        }
      });

      if (error) throw error;

      if (data.converted_audio) {
        const convertedBlob = new Blob(
          [Uint8Array.from(atob(data.converted_audio), c => c.charCodeAt(0))],
          { type: `audio/${targetFormat}` }
        );
        
        return convertedBlob;
      }

      throw new Error('No converted audio received');

    } catch (error: any) {
      console.error('Error converting audio format:', error);
      toast.error(`Audio conversion failed: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Update voice settings
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Clean up audio context
  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return {
    // Processing state
    isProcessing,
    currentAnalysis,
    
    // Voice settings
    voiceSettings,
    updateVoiceSettings,
    
    // Core functions
    transcribeWithAnalysis,
    synthesizeSpeech,
    applyAudioEffects,
    convertAudioFormat,
    
    // Utilities
    initAudioContext,
    cleanup
  };
};