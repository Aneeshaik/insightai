import express from 'express'
import multer from 'multer'
import path from 'path'
import { extractTextFromPdf } from '../services/documentService.js';
import { createVectorStoreFromText } from '../services/llmService.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" })

router.post('/', upload.single('file'), async(req, res) => {
    try {
        if(!req.file) return res.status(400).json({ message: "No file uploaded" })
        const filePath = path.resolve(req.file.path)
        console.log("Processing file ", filePath)
        const text = await extractTextFromPdf(filePath)
        console.log("text text ", text)
        await createVectorStoreFromText(text)
        res.json({ message: "File processed and indexed successfully" })
    } catch(err) {
        console.error("Upload error ", err)
        res.status(500).json({ message: "Failed to process file" })
    }
})

export default router