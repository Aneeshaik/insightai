import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { HumanMessage } from '@langchain/core/messages'
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents"
dotenv.config()

const vectorStorePath = path.join('/tmp', 'vectorStore')

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function createVectorStoreFromText(text) {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });
        const docs = await splitter.splitDocuments([new Document({ pageContent: text })]);
        console.log("docs docs ", docs);
        const embeddings = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
            apiKey: process.env.GOOGLE_API_KEY
        });
        console.log("after embedding");
        console.log("Starting FaissStore.fromDocuments");
        const store = await FaissStore.fromDocuments(docs, embeddings);
        console.log("Completed FaissStore.fromDocuments");
        console.log("store sotore ", store);
        try{
           if(!fs.existsSync(vectorStorePath)){
            fs.mkdirSync(vectorStorePath, {recursive: true})
            console.log("Created vector store folder in temp")
           }
           const saveResult = await store.save(vectorStorePath);
           console.log("Saved result ", saveResult)
        } catch(error) {
            console.log("Error in saving the file ", error)
        }
        console.log("Test store saved");
    } catch (error) {
        console.error("Error in createVectorStoreFromText:", error);
        throw error;
    }
}

export async function loadVectorStore() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "gemini-embedding-001",
        apiKey: process.env.GOOGLE_API_KEY
    })
    const store = await FaissStore.load(vectorStorePath, embeddings)
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