import React, { useState, useRef } from 'react';
import { Camera, Upload, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWorkerOCR } from '@/hooks/useWorkerOCR';

interface OCRScreenCaptureProps {
  onTextReceived: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

const OCRScreenCapture: React.FC<OCRScreenCaptureProps> = ({ onTextReceived, isVisible, onClose }) => {
  const [extractedText, setExtractedText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use worker-enhanced OCR hook
  const { processImage, processScreenCapture, isProcessing, progress } = useWorkerOCR();

  const captureScreen = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen capture is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          canvas.toBlob(async (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
              
              // Use worker thread for OCR processing
              try {
                const result = await processImage(new File([blob], 'screenshot.png', { type: 'image/png' }));
                setExtractedText(result.text);
                console.log(`OCR completed: ${result.text.length} characters extracted with ${result.confidence}% confidence`);
              } catch (error) {
                console.error('OCR processing failed:', error);
                alert('Failed to extract text from screen capture. Please try again.');
              }
            }
          });
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error('Error capturing screen:', error);
      alert('Failed to capture screen. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Use worker thread for OCR processing
      try {
        const result = await processImage(file);
        setExtractedText(result.text);
        console.log(`OCR completed: ${result.text.length} characters extracted with ${result.confidence}% confidence`);
      } catch (error) {
        console.error('OCR processing failed:', error);
        alert('Failed to extract text from image. Please try again.');
      }
    }
  };


  const insertText = () => {
    if (extractedText.trim()) {
      onTextReceived(extractedText);
      setExtractedText('');
      setPreviewUrl(null);
      onClose();
    }
  };

  const reset = () => {
    setExtractedText('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-2 border-purple-200 shadow-xl dark:bg-slate-800/95 dark:border-slate-600">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">OCR Screen Capture</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isProcessing ? (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Processing... {progress > 0 && `${progress}%`}
                </Badge>
              ) : (
                <Badge variant="outline" className="dark:border-slate-500 dark:text-slate-300">
                  Ready to capture
                </Badge>
              )}
            </div>

            <div className="flex justify-center gap-2 mb-4">
              <Button
                onClick={captureScreen}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Screen
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                variant="outline"
                className="dark:border-slate-500 dark:text-slate-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              {(previewUrl || extractedText) && (
                <Button onClick={reset} variant="ghost" size="sm">
                  Reset
                </Button>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            {previewUrl && (
              <div className="border rounded-lg p-2 bg-gray-50 dark:bg-slate-700 dark:border-slate-600">
                <img
                  src={previewUrl}
                  alt="Captured screen"
                  className="max-w-full max-h-40 mx-auto rounded"
                />
              </div>
            )}

            {extractedText && (
              <div className="space-y-2">
                <div className="bg-gray-50 border rounded-lg p-3 min-h-[120px] max-h-60 overflow-y-auto dark:bg-slate-700 dark:border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Extracted Text:</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap dark:text-slate-300">
                    {extractedText}
                  </p>
                </div>
                <Button
                  onClick={insertText}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Insert Extracted Text
                </Button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OCRScreenCapture;
