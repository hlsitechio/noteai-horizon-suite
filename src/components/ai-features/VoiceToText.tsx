import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Copy, 
  Upload,
  Volume2,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceToTextProps {
  onTextGenerated?: (text: string) => void;
  onTextAppended?: (text: string) => void;
}

interface TranscriptionSettings {
  language: string;
  autoAppend: boolean;
  enhanceText: boolean;
  punctuation: boolean;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' }
];

const VoiceToText: React.FC<VoiceToTextProps> = ({ onTextGenerated, onTextAppended }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [settings, setSettings] = useState<TranscriptionSettings>({
    language: 'en-US',
    autoAppend: true,
    enhanceText: true,
    punctuation: true
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Setup audio context for visualization
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await processAudio();
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring
      monitorAudioLevel();

      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        setIsPaused(false);
        toast.success('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPaused(true);
        toast.success('Recording paused');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setAudioLevel(0);
      toast.success('Recording stopped');
    }
  };

  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateLevel = () => {
        if (analyserRef.current && isRecording && !isPaused) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(average / 255);
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };
      
      updateLevel();
    }
  };

  const processAudio = async () => {
    if (chunksRef.current.length === 0) {
      toast.error('No audio data to process');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert chunks to blob
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
      
      // Convert to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: {
              audio: base64Audio,
              language: settings.language,
              enhance_text: settings.enhanceText,
              add_punctuation: settings.punctuation
            }
          });

          if (error) throw error;

          const transcription = data.text;
          setTranscribedText(prev => prev + (prev ? ' ' : '') + transcription);

          if (settings.autoAppend) {
            onTextAppended?.(transcription);
          }

          toast.success('Audio transcribed successfully!');
        } catch (error) {
          console.error('Transcription error:', error);
          toast.error('Failed to transcribe audio. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Audio processing error:', error);
      toast.error('Failed to process audio');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB');
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: {
              audio: base64Audio,
              language: settings.language,
              enhance_text: settings.enhanceText,
              add_punctuation: settings.punctuation
            }
          });

          if (error) throw error;

          const transcription = data.text;
          setTranscribedText(prev => prev + (prev ? ' ' : '') + transcription);

          if (settings.autoAppend) {
            onTextAppended?.(transcription);
          }

          toast.success('Audio file transcribed successfully!');
        } catch (error) {
          console.error('Transcription error:', error);
          toast.error('Failed to transcribe audio file');
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process audio file');
      setIsProcessing(false);
    }

    // Reset input
    event.target.value = '';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcribedText);
      toast.success('Text copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const clearText = () => {
    setTranscribedText('');
    toast.success('Text cleared');
  };

  const addToNote = () => {
    if (transcribedText.trim()) {
      onTextGenerated?.(transcribedText);
      toast.success('Text added to note!');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Voice to Text
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Convert speech to text using advanced AI transcription
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.autoAppend}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoAppend: e.target.checked }))}
                  className="rounded"
                />
                Auto-append to note
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.enhanceText}
                  onChange={(e) => setSettings(prev => ({ ...prev, enhanceText: e.target.checked }))}
                  className="rounded"
                />
                Enhance text with AI
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.punctuation}
                  onChange={(e) => setSettings(prev => ({ ...prev, punctuation: e.target.checked }))}
                  className="rounded"
                />
                Add punctuation
              </label>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                disabled={isProcessing}
              >
                <Mic className="h-5 w-5" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              </>
            )}

            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
                disabled={isRecording || isProcessing}
              />
              <Button
                asChild
                variant="outline"
                size="lg"
                disabled={isRecording || isProcessing}
              >
                <label htmlFor="audio-upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload Audio
                </label>
              </Button>
            </div>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-sm font-medium">
                  {isPaused ? 'Paused' : 'Recording'}: {formatTime(recordingTime)}
                </span>
              </div>
              
              {/* Audio Level Indicator */}
              <div className="w-full max-w-xs mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <Badge variant="secondary" className="animate-pulse">
                <Volume2 className="h-3 w-3 mr-1" />
                Processing audio...
              </Badge>
            </div>
          )}
        </div>

        {/* Transcription Result */}
        {transcribedText && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Transcribed Text</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {transcribedText.split(/\s+/).length} words
                </Badge>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={clearText}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              className="min-h-[120px]"
              placeholder="Transcribed text will appear here..."
            />

            <Button
              onClick={addToNote}
              className="w-full"
              disabled={!transcribedText.trim()}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Add to Note
            </Button>
          </div>
        )}

        {/* Browser Compatibility Check */}
        {!navigator.mediaDevices?.getUserMedia && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Voice recording requires a modern browser with microphone support
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceToText;