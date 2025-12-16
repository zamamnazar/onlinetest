import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// In a real app, never hardcode keys. 
// However, per instructions we use process.env.API_KEY
// Ideally, we prompt the user for their key if not in env.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateQuestions = async (topic: string, count: number): Promise<Question[]> => {
  if (!apiKey) {
    console.error("API Key missing");
    throw new Error("API Key is missing. Please configure it.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} multiple choice questions about "${topic}". 
      Each question must have 4 options and 1 correct answer.
      Return purely JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }, // Just strings for options
              },
              correctOptionIndex: { type: Type.INTEGER, description: "Index (0-3) of the correct option" }
            },
            required: ["text", "options", "correctOptionIndex"]
          }
        }
      }
    });

    if (response.text) {
      const rawData = JSON.parse(response.text);
      
      // Transform to our Question type
      return rawData.map((q: any, idx: number) => ({
        id: `gen-${Date.now()}-${idx}`,
        text: q.text,
        options: q.options.map((optText: string, oIdx: number) => ({
          id: `opt-${idx}-${oIdx}`,
          text: optText
        })),
        correctOptionId: `opt-${idx}-${q.correctOptionIndex}`
      }));
    }
    return [];

  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const analyzePerformance = async (studentName: string, score: number, total: number, topic: string): Promise<string> => {
    if (!apiKey) return "AI Analysis unavailable (Missing API Key).";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A student named ${studentName} scored ${score} out of ${total} on a test about ${topic}. 
            Provide a short, encouraging, and constructive feedback paragraph (max 50 words) for them.`
        });
        return response.text || "Keep up the good work!";
    } catch (e) {
        return "Great job on completing the test!";
    }
}
