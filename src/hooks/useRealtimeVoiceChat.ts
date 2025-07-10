import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
  duration?: number;
  isPlaying?: boolean;
}

export interface VoiceSession {
  id: string;
  title: string;
  messages: VoiceMessage[];
  startTime: Date;
  endTime?: Date;
  totalDuration: number;
}

export const useRealtimeVoiceChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);
  
  const { toast } = useToast();

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Audio encoding utility
  const encodeAudioForAPI = useCallback((float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }, []);

  // PCM to WAV conversion
  const createWavFromPCM = useCallback((pcmData: Uint8Array) => {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }, []);

  // Audio queue for sequential playback
  const playAudioQueue = useCallback(async () => {
    if (!audioContextRef.current || isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    try {
      while (audioQueueRef.current.length > 0) {
        const audioData = audioQueueRef.current.shift()!;
        
        try {
          const wavData = createWavFromPCM(audioData);
          const audioBuffer = await audioContextRef.current!.decodeAudioData(wavData.buffer);
          
          await new Promise<void>((resolve) => {
            const source = audioContextRef.current!.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current!.destination);
            source.onended = () => resolve();
            source.start(0);
          });
        } catch (error) {
          console.error('Error playing audio chunk:', error);
        }
      }
    } finally {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [createWavFromPCM]);

  // Connect to realtime voice API
  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Disable WebSocket connection for now to prevent CSP violations
      console.warn('Voice chat WebSocket connection disabled - edge function not available');
      toast.error('Voice chat feature is currently unavailable');
      setIsLoading(false);
      return;
      
      // const wsUrl = `wss://ubxtmbgvibtjtjggjnjm.functions.supabase.co/realtime-voice-chat`;
      // wsRef.current = new WebSocket(wsUrl);

      /*
      WebSocket connection disabled to prevent CSP violations 
      until the edge function is properly implemented
      
      wsRef.current.onopen = () => {
        // ... all the WebSocket event handlers would go here
      };

      wsRef.current.onmessage = async (event) => {
        // ... message handling would go here
      };

      wsRef.current.onerror = (error) => {
        // ... error handling would go here
      };

      wsRef.current.onclose = () => {
        // ... close handling would go here
      };
      */
    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      toast.error('Failed to connect to voice chat');
      setIsLoading(false);
    }
  }, [toast, currentSession, playAudioQueue]);

  // Start recording user audio
  const startRecording = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to voice chat');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const encodedAudio = encodeAudioForAPI(new Float32Array(inputData));
        
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      
      // Store references for cleanup
      mediaRecorderRef.current = { stream, audioContext, source, processor } as any;

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  }, [encodeAudioForAPI, toast]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && typeof mediaRecorderRef.current === 'object') {
      const { stream, audioContext, source, processor } = mediaRecorderRef.current as any;
      
      if (source) source.disconnect();
      if (processor) processor.disconnect();
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      
      mediaRecorderRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  // Disconnect from voice chat
  const disconnect = useCallback(() => {
    stopRecording();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    audioQueueRef.current = [];
    setIsConnected(false);
    setIsRecording(false);
    setIsPlaying(false);
  }, [stopRecording]);

  // Send text message (for hybrid mode)
  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast.error('Not connected to voice chat');
      return;
    }

    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));

    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, [toast]);

  return {
    // Connection state
    isConnected,
    isLoading,
    connect,
    disconnect,
    
    // Recording state
    isRecording,
    startRecording,
    stopRecording,
    
    // Playback state
    isPlaying,
    
    // Messages and session
    messages,
    currentSession,
    sendTextMessage,
    
    // Utilities
    clearMessages: () => setMessages([])
  };
};