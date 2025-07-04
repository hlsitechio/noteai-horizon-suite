
import { Note } from '../types/note';
import { logger } from '../utils/logger';

export class DocumentGenerationService {
  static async generateWordDocument(note: Note): Promise<Blob> {
    try {
      // Use proper DOCX generation with the docx library
      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import('docx');
      
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              text: note.title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: '' })], // Empty line
            }),
            new Paragraph({
              text: this.extractPlainText(note.content),
            }),
            new Paragraph({
              children: [new TextRun({ text: '' })], // Empty line
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Tags: ', bold: true }),
                new TextRun({ text: note.tags.join(', ') }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Created: ', bold: true }),
                new TextRun({ text: new Date(note.createdAt).toLocaleDateString() }),
              ],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      return blob;
    } catch (error) {
      logger.error('Failed to generate Word document:', error);
      // Fallback to RTF format
      const rtfContent = this.createRTFContent(note);
      return new Blob([rtfContent], { 
        type: 'application/rtf' 
      });
    }
  }

  private static createRTFContent(note: Note): string {
    const title = note.title.replace(/[{}\\]/g, '\\$&');
    const content = note.content.replace(/[{}\\]/g, '\\$&').replace(/\n/g, '\\par ');
    const tags = note.tags.join(', ');
    const date = new Date(note.createdAt).toLocaleDateString();

    return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 \\b ${title}\\b0\\par
\\par
${content}\\par
\\par
\\line
\\i Tags: ${tags}\\i0\\par
\\i Category: ${note.category}\\i0\\par
\\i Created: ${date}\\i0\\par
}`;
  }

  static async generatePDF(note: Note): Promise<Blob> {
    try {
      // Use proper PDF generation with jsPDF
      const jsPDF = await import('jspdf');
      const doc = new jsPDF.default();
      
      // Title
      doc.setFontSize(18);
      doc.text(note.title, 20, 30);
      
      // Content
      doc.setFontSize(12);
      const plainContent = this.extractPlainText(note.content);
      const splitText = doc.splitTextToSize(plainContent, 170);
      doc.text(splitText, 20, 50);
      
      // Tags and metadata
      const yPosition = 50 + (splitText.length * 5) + 20;
      doc.setFontSize(10);
      doc.text(`Tags: ${note.tags.join(', ')}`, 20, yPosition);
      doc.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, 20, yPosition + 10);
      
      return doc.output('blob');
    } catch (error) {
      logger.error('Failed to generate PDF:', error);
      // Fallback to basic PDF structure
      const pdfContent = this.createSimplePDFContent(note);
      return new Blob([pdfContent], { type: 'application/pdf' });
    }
  }

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

  private static createSimplePDFContent(note: Note): string {
    // This is a very basic PDF structure - in production, use jsPDF
    return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(${note.title}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
300
%%EOF`;
  }
}
