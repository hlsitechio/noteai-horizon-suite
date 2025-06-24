import { Note } from '../types/note';

export type ExportFormat = 'txt' | 'md' | 'html' | 'json' | 'docx' | 'pdf';
export type SharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';

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

  // Updated export function using your streamlined approach
  static async exportAsFile(format: ExportFormat, note: Note): Promise<void> {
    const plainContent = this.extractPlainText(note.content);
    const title = note.title;
    
    const blobMap = {
      txt: new Blob([this.exportToText(note)], { type: 'text/plain' }),
      md: new Blob([this.exportToMarkdown(note)], { type: 'text/markdown' }),
      html: new Blob([this.exportToHTML(note)], { type: 'text/html' }),
      json: new Blob([this.exportToJSON(note)], { type: 'application/json' }),
    };

    if (format === 'docx') return this.exportAsDocx(title, plainContent);
    if (format === 'pdf') return this.exportAsPDF(title, plainContent);

    const blob = blobMap[format as keyof typeof blobMap];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  private static async exportAsDocx(title: string, body: string): Promise<void> {
    try {
      const { Document, Packer, Paragraph } = await import('docx');
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: title, heading: 'Heading1' }),
              new Paragraph({ text: body }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to export as DOCX:', error);
      throw new Error('DOCX export failed. The required package could not be loaded.');
    }
  }

  private static async exportAsPDF(title: string, body: string): Promise<void> {
    try {
      const jsPDF = await import('jspdf');
      const doc = new jsPDF.default();
      doc.setFontSize(16);
      doc.text(title, 10, 10);
      doc.setFontSize(12);
      // Handle text wrapping for long content
      const splitText = doc.splitTextToSize(body, 180);
      doc.text(splitText, 10, 30);
      doc.save(`${title}.pdf`);
    } catch (error) {
      console.error('Failed to export as PDF:', error);
      throw new Error('PDF export failed. The required package could not be loaded.');
    }
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

  static async copyToClipboard(content: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // Updated share functions using your streamlined approach
  private static encoded = (str: string) => encodeURIComponent(str);

  private static shareLinks = {
    facebook: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${this.encoded(url)}`,
    twitter: (title: string, url: string) => `https://twitter.com/intent/tweet?text=${this.encoded(title)}&url=${this.encoded(url)}`,
    linkedin: (title: string, url: string) => `https://www.linkedin.com/shareArticle?mini=true&url=${this.encoded(url)}&title=${this.encoded(title)}`,
    whatsapp: (title: string, url: string) => `https://wa.me/?text=${this.encoded(`${title} ${url}`)}`,
    email: (title: string, body: string) => `mailto:?subject=${this.encoded(title)}&body=${this.encoded(body)}`,
  };

  static getShareUrl(platform: SharePlatform, note: Note): string {
    const plainContent = this.extractPlainText(note.content);
    const title = note.title;
    const tags = note.tags.length > 0 ? `\n\nTags: ${note.tags.map(tag => `#${tag}`).join(' ')}` : '';
    const fullContent = `${title}\n\n${plainContent}${tags}`;
    const noteURL = window.location.href;

    if (platform === 'email') {
      return this.shareLinks.email(title, fullContent);
    }
    
    return this.shareLinks[platform](title, noteURL);
  }

  static openShare(platform: SharePlatform, note: Note): void {
    const shareURL = this.getShareUrl(platform, note);
    window.open(shareURL, '_blank');
  }

  static async shareWithWebAPI(note: Note): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const plainContent = this.extractPlainText(note.content);
      const tags = note.tags.length > 0 ? `\n\nTags: ${note.tags.map(tag => `#${tag}`).join(' ')}` : '';
      const fullContent = `${plainContent}${tags}`;

      await navigator.share({
        title: note.title,
        text: fullContent
      });
      return true;
    } catch (error) {
      console.error('Web Share API failed:', error);
      return false;
    }
  }
}
