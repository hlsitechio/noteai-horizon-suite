
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExportFormat } from '../../services/noteExportService';

interface CopySectionProps {
  onCopy: (format: ExportFormat) => void;
}

const CopySection: React.FC<CopySectionProps> = ({ onCopy }) => {
  const copyFormats: { format: ExportFormat; label: string; description: string }[] = [
    { format: 'txt', label: 'Plain Text', description: 'Copy as simple text' },
    { format: 'md', label: 'Markdown', description: 'Copy with markdown formatting' },
    { format: 'html', label: 'HTML', description: 'Copy as HTML code' },
    { format: 'json', label: 'JSON', description: 'Copy as structured data' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Copy to Clipboard</h3>
      <div className="grid grid-cols-2 gap-3">
        {copyFormats.map(({ format, label, description }) => (
          <Button
            key={format}
            onClick={() => onCopy(format)}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start"
          >
            <span className="font-medium">{label}</span>
            <span className="text-sm text-gray-500">{description}</span>
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Copy your note in different formats to paste anywhere - Gmail, Slack, Discord, or any other app.
      </p>
    </div>
  );
};

export default CopySection;
