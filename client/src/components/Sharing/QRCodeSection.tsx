
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Note } from '../../types/note';
import { NoteExportService } from '../../services/noteExportService';
import { toast } from 'sonner';

interface QRCodeSectionProps {
  note: Note;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ note }) => {
  const [qrData, setQrData] = useState<string>('');
  const [qrType, setQrType] = useState<'url' | 'content'>('url');

  React.useEffect(() => {
    if (qrType === 'url') {
      setQrData(`${window.location.origin}/note/${note.id}`);
    } else {
      setQrData(NoteExportService.exportToText(note));
    }
  }, [qrType, note]);

  const downloadQRCode = () => {
    try {
      const svg = document.querySelector('#qr-code svg') as SVGElement;
      if (svg) {
        // Convert SVG to canvas and then to image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Serialize SVG to string
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          canvas.width = 200;
          canvas.height = 200;
          ctx?.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${note.title}-qr.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('QR Code downloaded');
            }
          }, 'image/png');
          
          URL.revokeObjectURL(url);
        };
        
        img.src = url;
      }
    } catch (error) {
      toast.error('Failed to download QR Code');
      console.error('QR download error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">QR Code Sharing</h3>
      
      <div className="flex gap-2 mb-4">
        <Button
          variant={qrType === 'url' ? 'default' : 'outline'}
          onClick={() => setQrType('url')}
          size="sm"
        >
          Share Link
        </Button>
        <Button
          variant={qrType === 'content' ? 'default' : 'outline'}
          onClick={() => setQrType('content')}
          size="sm"
        >
          Note Content
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <div id="qr-code">
            <QRCodeSVG
              value={qrData}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {qrType === 'url' 
                ? 'Scan to open note in browser' 
                : 'Scan to view note content'
              }
            </p>
            <Button onClick={downloadQRCode} variant="outline" size="sm">
              Download QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600">
        Generate a QR code to easily share your note with mobile devices.
      </p>
    </div>
  );
};

export default QRCodeSection;
