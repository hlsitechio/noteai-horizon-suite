import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async (): Promise<boolean> => {
    try {
      console.log('Requesting microphone access...');
      
      // Try with flexible constraints first, fallback to basic audio if needed
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
      } catch (constraintsError) {
        console.log('Trying with basic audio constraints...', constraintsError);
        // Fallback to basic audio constraints
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      }

      console.log('Microphone access granted');

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('Recording started');
      return true;

    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please check your browser settings and allow microphone access for this site.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please check your device has a microphone.');
      } else if (error.name === 'NotSupportedError') {
        toast.error('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.');
      } else if (error.name === 'AbortError') {
        toast.error('Microphone access was interrupted. Please try again and ensure no other applications are using the microphone.');
      } else {
        toast.error(`Microphone error: ${error.message}. Try refreshing the page or check browser permissions.`);
      }
      
      return false;
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || !isRecording) {
      return null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        console.log('Processing recorded audio...');
        setIsRecording(false);
        setIsProcessing(true);

        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log(`Audio blob size: ${audioBlob.size} bytes`);

          if (audioBlob.size < 1000) {
            throw new Error('Recording too short, please try again');
          }

          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              console.log('Sending audio for transcription...');

              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio }
              });

              if (error) {
                console.error('Supabase function error:', error);
                throw new Error(`Transcription failed: ${(error as any)?.message || 'Unknown error'}`);
              }

              if (!data || !data.text) {
                throw new Error('No transcription returned');
              }

              console.log('Transcription successful:', data.text);
              toast.success('Speech converted to text!');
              resolve(data.text);
              
            } catch (error: any) {
              console.error('Error during transcription:', error);
              toast.error(`Transcription failed: ${error.message}`);
              resolve(null);
            } finally {
              setIsProcessing(false);
            }
          };

          reader.onerror = () => {
            console.error('Error reading audio file');
            toast.error('Failed to process audio file');
            setIsProcessing(false);
            resolve(null);
          };

          reader.readAsDataURL(audioBlob);

        } catch (error: any) {
          console.error('Error processing recording:', error);
          toast.error(error.message);
          setIsProcessing(false);
          resolve(null);
        }
      };

      mediaRecorder.stop();
    });
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording cancelled');
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};