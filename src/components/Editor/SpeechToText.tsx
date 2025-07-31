
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpeechToTextProps {
  onTextReceived: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTextReceived, isVisible, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          onTextReceived(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTextReceived]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const insertText = () => {
    if (transcript.trim()) {
      onTextReceived(transcript);
      setTranscript('');
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-blue-200 shadow-xl dark:bg-slate-800/95 dark:border-slate-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Speech to Text</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {!isSupported ? (
            <div className="text-center py-4">
              <p className="text-red-600 dark:text-red-400">Speech recognition is not supported in this browser.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                {isListening ? (
                  <Badge className="bg-red-100 text-red-700 animate-pulse dark:bg-red-900/50 dark:text-red-300">
                    🎤 Listening...
                  </Badge>
                ) : (
                  <Badge variant="outline" className="dark:border-slate-500 dark:text-slate-300">
                    Ready to listen
                  </Badge>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  onClick={startListening}
                  disabled={isListening}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button
                  onClick={stopListening}
                  disabled={!isListening}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>

              {transcript && (
                <div className="mt-4">
                  <div className="bg-gray-50 border rounded-lg p-3 min-h-[100px] dark:bg-slate-700 dark:border-slate-600">
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {transcript || 'Transcript will appear here...'}
                    </p>
                  </div>
                  <Button
                    onClick={insertText}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Insert Text
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeechToText;
