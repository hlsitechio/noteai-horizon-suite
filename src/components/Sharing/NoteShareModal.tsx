
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Note } from '../../types/note';
import { NoteExportService, ExportFormat, SharePlatform } from '../../services/noteExportService';
import { DocumentGenerationService } from '../../services/documentGenerationService';
import ShareButtons from './ShareButtons';
import ExportButtons from './ExportButtons';
import QRCodeSection from './QRCodeSection';
import CopySection from './CopySection';

interface NoteShareModalProps {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
}

const NoteShareModal: React.FC<NoteShareModalProps> = ({ note, isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('share');

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'txt':
          content = NoteExportService.exportToText(note);
          filename = `${note.title}.txt`;
          mimeType = 'text/plain';
          break;
        case 'md':
          content = NoteExportService.exportToMarkdown(note);
          filename = `${note.title}.md`;
          mimeType = 'text/markdown';
          break;
        case 'html':
          content = NoteExportService.exportToHTML(note);
          filename = `${note.title}.html`;
          mimeType = 'text/html';
          break;
        case 'json':
          content = NoteExportService.exportToJSON(note);
          filename = `${note.title}.json`;
          mimeType = 'application/json';
          break;
        default:
          throw new Error('Unsupported format');
      }

      NoteExportService.downloadFile(content, filename, mimeType);
      toast.success(`Note exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export note');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDocumentExport = async (type: 'word' | 'pdf') => {
    setIsExporting(true);
    try {
      let blob: Blob;
      let filename: string;

      if (type === 'word') {
        blob = await DocumentGenerationService.generateWordDocument(note);
        filename = `${note.title}.rtf`;
      } else {
        blob = await DocumentGenerationService.generatePDF(note);
        filename = `${note.title}.pdf`;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Note exported as ${type.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export as ${type.toUpperCase()}`);
      console.error('Document export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (platform: SharePlatform) => {
    try {
      if (platform === 'email') {
        window.open(NoteExportService.getShareUrl(platform, note));
      } else {
        const webShareSuccess = await NoteExportService.shareWithWebAPI(note);
        if (!webShareSuccess) {
          window.open(NoteExportService.getShareUrl(platform, note), '_blank');
        }
      }
      toast.success('Note shared successfully');
    } catch (error) {
      toast.error('Failed to share note');
      console.error('Share error:', error);
    }
  };

  const handleCopy = async (format: ExportFormat) => {
    try {
      let content: string;
      
      switch (format) {
        case 'txt':
          content = NoteExportService.exportToText(note);
          break;
        case 'md':
          content = NoteExportService.exportToMarkdown(note);
          break;
        case 'html':
          content = NoteExportService.exportToHTML(note);
          break;
        case 'json':
          content = NoteExportService.exportToJSON(note);
          break;
        default:
          content = note.content;
      }

      const success = await NoteExportService.copyToClipboard(content);
      if (success) {
        toast.success(`Note copied as ${format.toUpperCase()}`);
      } else {
        toast.error('Failed to copy to clipboard');
      }
    } catch (error) {
      toast.error('Failed to copy note');
      console.error('Copy error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share & Export Note</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="copy">Copy</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <ShareButtons onShare={handleShare} />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <ExportButtons 
              onExport={handleExport}
              onDocumentExport={handleDocumentExport}
              isExporting={isExporting}
            />
          </TabsContent>

          <TabsContent value="copy" className="space-y-4">
            <CopySection onCopy={handleCopy} />
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <QRCodeSection note={note} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NoteShareModal;
