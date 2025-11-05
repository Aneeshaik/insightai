import fs from 'fs';

let pdf;
const loadPdfParse = async () => {
  const mod = await import('pdf-parse');
  pdf = mod.default || mod;
};
await loadPdfParse();

export async function extractTextFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
}
