import * as pdfjsLib from 'pdfjs-dist/webpack';
import 'pdfjs-dist/web/pdf_viewer.css';

async function extractTextFromPDF(fileBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    text += pageText + ' ';
  }

  return text;
}

export { extractTextFromPDF };