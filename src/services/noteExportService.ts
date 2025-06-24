
import { Note } from '../types/note';

export type ExportFormat = 'txt' | 'md' | 'html' | 'json';
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

  static getShareUrl(platform: SharePlatform, note: Note): string {
    // Extract plain text from rich text content
    const plainContent = this.extractPlainText(note.content);
    const noteTitle = note.title;
    const tags = note.tags.length > 0 ? `\n\nTags: ${note.tags.map(tag => `#${tag}`).join(' ')}` : '';
    
    // Combine title, content, and tags for sharing
    const fullContent = `${noteTitle}\n\n${plainContent}${tags}`;
    
    // For platforms with character limits, we might need to truncate
    const truncateContent = (content: string, maxLength: number) => {
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength - 3) + '...';
    };
    
    const encodedTitle = encodeURIComponent(noteTitle);
    const encodedContent = encodeURIComponent(fullContent);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedContent}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncateContent(fullContent, 280))}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodedTitle}&summary=${encodeURIComponent(truncateContent(plainContent, 600))}&source=NotesApp`,
      whatsapp: `https://wa.me/?text=${encodedContent}`,
      email: `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodedTitle}&body=${encodedContent}`
    };

    return urls[platform];
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
