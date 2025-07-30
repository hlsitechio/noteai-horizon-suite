
import { Note } from '../types/note';
import { NoteDocumentExportService } from './noteDocumentExportService';

export type ExportFormat = 'txt' | 'md' | 'html' | 'json' | 'docx' | 'pdf';

export class NoteExportService {
  // Helper function to extract plain text from rich text content
  private static extractPlainText(content: string): string {
    try {
      // Try to parse as JSON (Slate format)
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed
          .map((node: any) => {
            if (node.children && Array.isArray(node.children)) {
              return node.children
                .map((child: any) => child.text || '')
                .join('');
            }
            return '';
          })
          .join('\n')
          .trim();
      }
    } catch {
      // If not JSON, return as plain text
      return content;
    }
    return content;
  }

  static exportToText(note: Note): string {
    const plainContent = this.extractPlainText(note.content);
    return `${note.title}\n\n${plainContent}\n\nTags: ${note.tags.join(', ')}\nCategory: ${note.category}`;
  }

  static exportToMarkdown(note: Note): string {
    const plainContent = this.extractPlainText(note.content);
    const tags = note.tags.map(tag => `#${tag}`).join(' ');
    return `# ${note.title}\n\n${plainContent}\n\n---\n\n**Tags:** ${tags}\n**Category:** ${note.category}\n**Created:** ${new Date(note.createdAt).toLocaleDateString()}`;
  }

  static exportToHTML(note: Note): string {
    const plainContent = this.extractPlainText(note.content);
    const tags = note.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${note.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .tag { background: #e2e8f0; padding: 2px 8px; border-radius: 12px; font-size: 0.875rem; }
        .metadata { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; }
    </style>
</head>
<body>
    <h1>${note.title}</h1>
    <div>${plainContent.replace(/\n/g, '<br>')}</div>
    <div class="metadata">
        <p><strong>Tags:</strong> ${tags}</p>
        <p><strong>Category:</strong> ${note.category}</p>
        <p><strong>Created:</strong> ${new Date(note.createdAt).toLocaleDateString()}</p>
    </div>
</body>
</html>`;
  }

  static exportToJSON(note: Note): string {
    return JSON.stringify(note, null, 2);
  }

  static async exportAsFile(format: ExportFormat, note: Note): Promise<void> {
    const title = note.title;
    
    const blobMap = {
      txt: new Blob([this.exportToText(note)], { type: 'text/plain' }),
      md: new Blob([this.exportToMarkdown(note)], { type: 'text/markdown' }),
      html: new Blob([this.exportToHTML(note)], { type: 'text/html' }),
      json: new Blob([this.exportToJSON(note)], { type: 'application/json' }),
    };

    if (format === 'docx') return NoteDocumentExportService.exportAsDocx(note);
    if (format === 'pdf') return NoteDocumentExportService.exportAsPDF(note);

    const blob = blobMap[format as keyof typeof blobMap];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
