import express from 'express'
import { askLLM, loadVectorStore } from '../services/llmService.js';

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const { message } = req.body
        if(!message) return res.status(400).json({ reply: "Message required" })

        const store = await loadVectorStore();
        const results = await store.similaritySearch(message, 3)

        const context = results.map(r => r.pageContent).join("/n");
        const prompt = `You are an AI assistant. Use the following context to answer:\n\n${context}\n\nUser: ${message}`;
        const reply = await askLLM(prompt)
        res.json({ reply })
    } catch (err) {
        console.error(err)
        res.status(500).json({ reply: "Error generating response" })
    }
})

export default router