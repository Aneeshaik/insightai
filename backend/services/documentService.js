import fs from 'fs';

export async function extractTextFromPdf(filePath) {
  try {
    console.log("📄 Trying to read:", filePath);

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    console.log("✅ File read successfully, size:", dataBuffer.length);

    // Lazy-load pdf-parse only when needed
    const mod = await import('pdf-parse');
    const pdf = mod.default || mod;

    const pdfData = await pdf(dataBuffer);
    console.log("✅ Text extracted successfully, length:", pdfData.text?.length);

    return pdfData.text;
  } catch (err) {
    console.error("❌ PDF extraction error:", err);
    throw err;
  }
}
