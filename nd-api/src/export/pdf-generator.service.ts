import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PDFGeneratorService {
  async generatePdf(title: string, lines: string[]): Promise<Buffer> {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text(title);
      doc.moveDown();
      lines.forEach((line) => doc.fontSize(12).text(line));
      doc.end();
    });
  }
}

