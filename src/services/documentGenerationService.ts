
import { Note } from '../types/note';

export class DocumentGenerationService {
  static async generateWordDocument(note: Note): Promise<Blob> {
    // For now, we'll create a rich text format that can be opened by Word
    // Later we can integrate with docx library if needed
    const rtfContent = this.createRTFContent(note);
    return new Blob([rtfContent], { 
      type: 'application/rtf' 
    });
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
    // Simple PDF generation using canvas and basic PDF structure
    // For a full implementation, we'd use jsPDF library
    const pdfContent = this.createSimplePDFContent(note);
    return new Blob([pdfContent], { type: 'application/pdf' });
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
