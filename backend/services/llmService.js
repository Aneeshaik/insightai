import dotenv from 'dotenv'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { HumanMessage } from '@langchain/core/messages'
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents"
import { OpenAI } from 'openai'
dotenv.config()

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function createVectorStoreFromText(text) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const docs = splitter.splitDocuments([new Document({ pageContent: text })])
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY
    })
    const store = await FaissStore.fromDocuments(await docs, embeddings)
    await store.save("./vectorStore")
}

export async function loadVectorStore() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY
    })
    const store = await FaissStore.load('./vectorStore', embeddings)
    return store
}

export async function askLLM(prompt) {
    try {
        const response = await llm.invoke([new HumanMessage(prompt)]);
        return response;
    } catch (err) {
        console.error("LLM Error: ", err)
        return "Sorry, I couldn't generate a response."
    }
}