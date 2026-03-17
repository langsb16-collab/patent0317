import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface OAAnalysisResult {
  type: string;
  summary: string;
  weaknesses: string[];
  strategy: string;
  draftResponse: string;
}

export async function analyzeOA(oaText: string, language: string = 'Korean'): Promise<OAAnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are an expert Patent Attorney. Analyze the following Office Action (OA) text and provide a structured response in ${language}.
    
    OA Text:
    ${oaText}
    
    Please provide the analysis in the following JSON format:
    {
      "type": "Classification of rejection (e.g., Novelty, Inventive Step, Clarity)",
      "summary": "Brief summary of the examiner's arguments",
      "weaknesses": ["List of logical weaknesses in the examiner's reasoning"],
      "strategy": "Recommended response strategy (e.g., Amendment, Argumentation)",
      "draftResponse": "A professional draft of the response (Opinion/Amendment)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      type: result.type || 'Unknown',
      summary: result.summary || '',
      weaknesses: result.weaknesses || [],
      strategy: result.strategy || '',
      draftResponse: result.draftResponse || ''
    };
  } catch (error) {
    console.error("OA Analysis failed:", error);
    throw error;
  }
}
