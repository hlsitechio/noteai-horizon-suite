
import { Note } from '../types/note';

export type SharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';

export class NoteSharingService {
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

  static async copyToClipboard(content: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}
