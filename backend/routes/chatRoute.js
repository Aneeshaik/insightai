import express from 'express'
import { askLLM, loadVectorStore } from '../services/llmService.js';
import fs from 'fs'

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const { message } = req.body
        if(!message) return res.status(400).json({ reply: "Message required" })
        let store
        try{
            const indexPath = './vectorStore/faiss.index'
            fs.access(indexPath)
            store = await loadVectorStore()
        } catch (err) {
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