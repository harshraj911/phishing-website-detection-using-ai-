
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const systemInstruction = `
You are a highly advanced AI-powered Phishing Detection System. 
Your goal is to analyze a provided URL to determine if it is a phishing attempt, suspicious, or legitimate.

CRITICAL INSTRUCTION:
1. You MUST use the Google Search tool to verify if the domain actually exists and is currently active. 
2. If the domain does NOT exist, is unreachable, or looks like a parked domain with no real content, you MUST classify it as "SUSPICIOUS" or "PHISHING" depending on context, and set the risk level to "High" or "Medium". Do NOT classify non-existent sites as "Legitimate".
3. Check for recent phishing reports regarding the domain using search.

OUTPUT FORMAT:
You must respond with a raw JSON object. Do not include markdown formatting (like \`\`\`json).
The JSON must strictly adhere to this structure:
{
  "classification": "phishing" | "legitimate" | "suspicious",
  "confidenceScore": number, // 0.0 to 1.0
  "riskLevel": "High" | "Medium" | "Low" | "None",
  "summary": "A concise summary of findings, specifically mentioning if the site exists or not based on search results.",
  "featureAnalysis": [
    {
      "feature": "string", // e.g., "Domain Existence", "SSL", "Reputation"
      "status": "string",
      "risk": "High" | "Medium" | "Low" | "None",
      "details": "string"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this URL: ${url}`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text || "";
    
    // robust JSON extraction
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid response format: No JSON object found.");
    }
    
    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    const result = JSON.parse(jsonStr) as AnalysisResult;

    // Extract grounding URLs (search sources)
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web?.uri)
        .filter((uri: any): uri is string => typeof uri === 'string') || [];

    result.groundingUrls = groundingUrls;

    // Basic validation
    if (!result.classification || !result.featureAnalysis) {
        throw new Error("Invalid JSON structure from AI.");
    }

    return result;
  } catch (error) {
    console.error("Error analyzing URL with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The service may be busy or the URL is invalid.");
  }
};
