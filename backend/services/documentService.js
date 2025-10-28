import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { PDFParse } = require('pdf-parse');

export async function extractTextFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath)
    const dataArray = new Uint8Array(dataBuffer)
    const parser = new PDFParse(dataArray, {
        standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/standard_fonts/' // Use a CDN for pdf.js fonts
    })
    const pdfData = await parser.getText();
    return pdfData.text
}