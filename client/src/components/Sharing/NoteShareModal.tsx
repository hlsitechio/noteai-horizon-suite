
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Note } from '../../types/note';
import { NoteExportService, ExportFormat } from '../../services/noteExportService';
import { NoteSharingService, SharePlatform } from '../../services/noteSharingService';
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
      await NoteExportService.exportAsFile(format, note);
      toast.success(`Note exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDocumentExport = async (type: 'docx' | 'pdf') => {
    setIsExporting(true);
    try {
      await NoteExportService.exportAsFile(type, note);
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
      // Try Web Share API first for mobile devices
      if (platform !== 'email') {
        const webShareSuccess = await NoteSharingService.shareWithWebAPI(note);
        if (webShareSuccess) {
          toast.success('Note shared successfully');
          return;
        }
      }
      
      // Fall back to opening share URLs
      NoteSharingService.openShare(platform, note);
      toast.success('Share window opened');
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

      const success = await NoteSharingService.copyToClipboard(content);
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
