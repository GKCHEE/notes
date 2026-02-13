
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

export async function generateSqlSchema(userPrompt: string): Promise<GenerationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a world-class Database Architect specializing in PostgreSQL and Supabase.
    Your task is to generate clean, production-ready SQL scripts based on user requirements.
    
    Guidelines:
    1. ALWAYS include standard Supabase practices:
       - Use 'auth.uid()' for user-based RLS policies.
       - Use UUIDs for primary keys where appropriate (gen_random_uuid()).
       - Use TIMESTAMPTZ for dates.
       - Tables like 'profiles' should link to 'auth.users'.
    2. ALWAYS include Row Level Security (RLS) setup:
       - 'ALTER TABLE name ENABLE ROW LEVEL SECURITY;'
       - 'CREATE POLICY' for SELECT, INSERT, UPDATE, DELETE.
    3. INCLUDE Storage bucket creation if requested:
       - 'INSERT INTO storage.buckets (id, name, public) VALUES (...)'
       - Storage policies for authenticated users.
    4. FORMATting: Return ONLY a JSON object with two fields: 'sql' (the code) and 'explanation' (brief summary).
    5. Be concise and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql: { type: Type.STRING, description: "The raw SQL script block." },
            explanation: { type: Type.STRING, description: "A brief explanation of the architecture." }
          },
          required: ["sql", "explanation"]
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as GenerationResult;
  } catch (error) {
    console.error("SQL Generation Error:", error);
    throw error;
  }
}
