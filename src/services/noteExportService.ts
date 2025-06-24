
import { Note } from '../types/note';

export type ExportFormat = 'txt' | 'md' | 'html' | 'json';
export type SharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';

export class NoteExportService {
  static exportToText(note: Note): string {
    return `${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}\nCategory: ${note.category}`;
  }

  static exportToMarkdown(note: Note): string {
    const tags = note.tags.map(tag => `#${tag}`).join(' ');
    return `# ${note.title}\n\n${note.content}\n\n---\n\n**Tags:** ${tags}\n**Category:** ${note.category}\n**Created:** ${new Date(note.createdAt).toLocaleDateString()}`;
  }

  static exportToHTML(note: Note): string {
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
    <div>${note.content.replace(/\n/g, '<br>')}</div>
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
    // Create the complete note content to share
    const noteTitle = note.title;
    const noteContent = note.content;
    const tags = note.tags.length > 0 ? `\n\nTags: ${note.tags.map(tag => `#${tag}`).join(' ')}` : '';
    
    // Combine title, content, and tags for sharing
    const fullContent = `${noteTitle}\n\n${noteContent}${tags}`;
    
    // For platforms with character limits, we might need to truncate
    const truncateContent = (content: string, maxLength: number) => {
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength - 3) + '...';
    };
    
    const encodedTitle = encodeURIComponent(noteTitle);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(fullContent)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncateContent(fullContent, 280))}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&title=${encodedTitle}&summary=${encodeURIComponent(truncateContent(fullContent, 600))}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fullContent)}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(fullContent)}`
    };

    return urls[platform];
  }

  static async shareWithWebAPI(note: Note): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const noteContent = `${note.title}\n\n${note.content}`;
      const tags = note.tags.length > 0 ? `\n\nTags: ${note.tags.map(tag => `#${tag}`).join(' ')}` : '';
      const fullContent = `${noteContent}${tags}`;

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
