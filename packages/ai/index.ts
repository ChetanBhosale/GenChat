import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config({path: '../../.env'});


export const AIModel = {
    ai : new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    model : {
      chat: process.env.GEMINI_MODEL_NAME,
      embedding: process.env.GEMINI_EMBEDDING_MODEL,
    }
}

