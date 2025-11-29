import { GoogleGenAI } from "@google/genai";
import { Trade, InsightResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  analyzePsychology: async (trades: Trade[]): Promise<InsightResult> => {
    if (!trades || trades.length < 3) {
      return {
        summary: "Log at least 3 trades to unlock AI-powered pattern recognition.",
        riskFactor: "Insufficient Data",
        strength: "Insufficient Data"
      };
    }

    // Prepare prompt data (lightweight JSON)
    const recentTrades = trades.slice(0, 10).map(t => ({
      state: t.emotionalState,
      impulse: t.impulsiveness,
      fear: t.fear,
      outcome: t.outcome,
      followedPlan: t.followedPlan,
      tilt: t.tilt,
      reflection: t.reflection
    }));

    const prompt = `
      You are an expert trading psychology coach. Analyze these recent trades for a day trader:
      ${JSON.stringify(recentTrades)}

      Provide a structured JSON response with 3 fields:
      1. "summary": A 1-2 sentence direct observation about their mindset and performance connection.
      2. "riskFactor": The single biggest psychological leak (e.g., "Overtrading in Charged state").
      3. "strength": What they are doing well (e.g., "High discipline when Neutral").

      Keep it concise, professional, and actionable.
      Return ONLY valid JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      return JSON.parse(text) as InsightResult;

    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return {
        summary: "Unable to generate insights at this moment. Please try again later.",
        riskFactor: "N/A",
        strength: "N/A"
      };
    }
  }
};
