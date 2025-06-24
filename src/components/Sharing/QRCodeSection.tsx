
import React, { useState } from 'react';
import QRCode from 'qrcode.react';
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
      const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `${note.title}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR Code downloaded');
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
            <QRCode
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
        Generate a QR code to easily share your note with mobile devices or for offline sharing.
      </p>
    </div>
  );
};

export default QRCodeSection;
