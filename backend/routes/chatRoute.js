import express from 'express'
import { askLLM, loadVectorStore } from '../services/llmService.js';
import path from 'path';
import fs from 'fs/promises'

const router = express.Router();
const vectorStorePath = path.join('/tmp', 'vectorStore')

router.post("/", async (req, res) => {
    try{
        const { message } = req.body
        if(!message) return res.status(400).json({ reply: "Message required" })
        let store
        const indexPath = path.resolve(vectorStorePath);
        console.log('Resolved indexPath:', indexPath);
        try {
            await fs.access(indexPath);
            console.log("Vector store found, loading...");
            store = await loadVectorStore();
        } catch (err) {
            console.error('Error accessing vector store:', err.message);
            console.log('Vector store not found, using LLM directly.');
        }
        let reply;
        if(store){
            // Perform similarity search if vector store is available
            const results = await store.similaritySearch(message, 3);
            const context = results.map(r => r.pageContent).join("\n");
            const prompt = `You are an AI assistant. Use the following context to answer:\n\n${context}\n\nUser: ${message}`;
            reply = await askLLM(prompt);
        } else {
            // Fallback to LLM without context if no vector store
            reply = await askLLM(`You are an AI assistant. User: ${message}`);
        }
        res.json({ reply: reply.content });
    } catch (err) {
        console.error(err)
        res.status(500).json({ reply: "Error generating response" })
    }
})

export default router