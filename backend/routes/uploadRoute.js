import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { extractTextFromPdf } from '../services/documentService.js';
import { createVectorStoreFromText } from '../services/llmService.js';

const router = express.Router();
const uploadDir = "/tmp/uploads"
fs.mkdir(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
})

router.post('/', upload.single('file'), async(req, res) => {
    try {
        if(!req.file) return res.status(400).json({ message: "No file uploaded" })
        const filePath = path.join(uploadDir, req.file.filename)
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