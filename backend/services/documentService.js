import fs from 'fs'
import * as pdf from 'pdf-parse'

export async function extractTextFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdf(dataBuffer)
    return pdfData.text
}