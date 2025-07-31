
import { Note } from '../types/note';

export class NoteDocumentExportService {
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

  static async exportAsDocx(note: Note): Promise<void> {
    const plainContent = this.extractPlainText(note.content);
    const title = note.title;
    
    try {
      const { Document, Packer, Paragraph } = await import('docx');
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: title, heading: 'Heading1' }),
              new Paragraph({ text: plainContent }),
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

  static async exportAsPDF(note: Note): Promise<void> {
    const plainContent = this.extractPlainText(note.content);
    const title = note.title;
    
    try {
      const jsPDF = await import('jspdf');
      const doc = new jsPDF.default();
      doc.setFontSize(16);
      doc.text(title, 10, 10);
      doc.setFontSize(12);
      // Handle text wrapping for long content
      const splitText = doc.splitTextToSize(plainContent, 180);
      doc.text(splitText, 10, 30);
      doc.save(`${title}.pdf`);
    } catch (error) {
      console.error('Failed to export as PDF:', error);
      throw new Error('PDF export failed. The required package could not be loaded.');
    }
  }
}
