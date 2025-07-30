
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExportFormat } from '../../services/noteExportService';

interface ExportButtonsProps {
  onExport: (format: ExportFormat) => void;
  onDocumentExport: (type: 'docx' | 'pdf') => void;
  isExporting: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  onExport, 
  onDocumentExport, 
  isExporting 
}) => {
  const textFormats: { format: ExportFormat; label: string; description: string }[] = [
    { format: 'txt', label: 'Plain Text', description: 'Simple text file' },
    { format: 'md', label: 'Markdown', description: 'Formatted markdown file' },
    { format: 'html', label: 'HTML', description: 'Web page format' },
    { format: 'json', label: 'JSON', description: 'Structured data format' },
  ];

  const documentFormats = [
    { type: 'docx' as const, label: 'Word Document', description: 'Microsoft Word format' },
    { type: 'pdf' as const, label: 'PDF Document', description: 'Portable document format' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Export as Text Format</h3>
        <div className="grid grid-cols-2 gap-3">
          {textFormats.map(({ format, label, description }) => (
            <Button
              key={format}
              onClick={() => onExport(format)}
              disabled={isExporting}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <span className="font-medium">{label}</span>
              <span className="text-sm text-gray-500">{description}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Export as Document</h3>
        <div className="grid grid-cols-2 gap-3">
          {documentFormats.map(({ type, label, description }) => (
            <Button
              key={type}
              onClick={() => onDocumentExport(type)}
              disabled={isExporting}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
            >
              <span className="font-medium">{label}</span>
              <span className="text-sm text-gray-500">{description}</span>
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Note: DOCX and PDF exports require additional packages to be downloaded when first used.
        </p>
      </div>

      <p className="text-sm text-gray-600">
        Download your note in various formats for sharing or cloud storage.
      </p>
    </div>
  );
};

export default ExportButtons;
