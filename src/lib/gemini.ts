import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeIdea(idea: string, type: 'text' | 'image' | 'voice', targetLang: string, imageData?: string) {
  const model = ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: imageData ? [
      { text: `Analyze this idea for patentability. Provide the entire response in ${targetLang}. Provide: 1. Patent Title, 2. Technical Field, 3. Background, 4. Invention Content, 5. Claims, 6. Novelty Score (0-100), 7. Similarity Score (0-100). Idea description: ${idea}` },
      { inlineData: { mimeType: "image/png", data: imageData } }
    ] : `Analyze this idea for patentability. Provide the entire response in ${targetLang}. Provide: 1. Patent Title, 2. Technical Field, 3. Background, 4. Invention Content, 5. Claims, 6. Novelty Score (0-100), 7. Similarity Score (0-100). Idea: ${idea}`,
    config: {
      temperature: 0.7,
    }
  });

  const response = await model;
  return response.text;
}

export async function translateText(text: string, targetLang: string) {
  const model = ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Translate the following text to ${targetLang}. Only return the translated text: "${text}"`,
  });
  const response = await model;
  return response.text;
}

export async function getFAQAnswer(question: string, lang: string) {
  const model = ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an AI FAQ assistant for a patent platform. Answer this question in ${lang}: "${question}"`,
  });
  const response = await model;
  return response.text;
}
