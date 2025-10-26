import dotenv from 'dotenv'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai"
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents"
import { OpenAI } from 'openai'
dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function createVectorStoreFromText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const docs = splitter.splitDocuments([new Document({ pageContent: text })])
    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY
    })
    const store = await FaissStore.fromDocuments(await docs, embeddings)
    await store.save("./vectorStore")
}

export async function loadVectorStore() {
    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY
    })
    const store = await FaissStore.load('./vectorStore', embeddings)
    return store
}

export async function askLLM(prompt) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            message: [{ role: "user", content: prompt }]
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error("LLM Error: ", err)
        return "Sorry, I couldn't generate a response."
    }
}