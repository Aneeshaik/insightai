import fs from 'fs';

let pdf;
const loadPdfParse = async () => {
  const mod = await import('pdf-parse');
  pdf = mod.default || mod;
};
await loadPdfParse();

export async function extractTextFromPdf(filePath) {
  console.log("📄 extractTextFromPdf called with path:", filePath);

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`PDF file not found at path: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  return pdfData.text;
}
