import fs from 'fs';

export async function extractTextFromPdf(filePath) {
  // Lazy-load pdf-parse only when function is called
  const mod = await import('pdf-parse');
  const pdf = mod.default || mod;

  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
}
