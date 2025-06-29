import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';
dotenv.config({path: '../../.env'});

const pc = new Pinecone ({ apiKey: process.env.PINECONE_API_KEY as string });

export const AIModel = {
    ai : new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    model : {
      chat: process.env.GEMINI_MODEL_NAME,
      embedding: process.env.GEMINI_EMBEDDING_MODEL,
    },
  pc
}

