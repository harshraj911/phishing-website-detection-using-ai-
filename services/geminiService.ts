
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { Classification, RiskLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        classification: { 
            type: Type.STRING,
            enum: [Classification.PHISHING, Classification.LEGITIMATE, Classification.SUSPICIOUS],
            description: "The final classification of the URL."
        },
        confidenceScore: { 
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating the confidence in the classification. Higher means more confident."
        },
        riskLevel: {
            type: Type.STRING,
            enum: [RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW, RiskLevel.NONE],
            description: "The overall risk level assessed for the URL."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one or two-sentence summary of the findings."
        },
        featureAnalysis: {
            type: Type.ARRAY,
            description: "A breakdown of the analysis across different features.",
            items: {
                type: Type.OBJECT,
                properties: {
                    feature: { type: Type.STRING, description: "The name of the feature analyzed (e.g., 'SSL Certificate', 'URL Structure')." },
                    status: { type: Type.STRING, description: "The status of the feature (e.g., 'Valid', 'Suspicious', 'Not Found')." },
                    risk: { 
                        type: Type.STRING,
                        enum: [RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW, RiskLevel.NONE],
                        description: "The risk level associated with this specific feature."
                    },
                    details: { type: Type.STRING, description: "A brief explanation of the findings for this feature." }
                },
                required: ["feature", "status", "risk", "details"]
            }
        }
    },
    required: ["classification", "confidenceScore", "riskLevel", "summary", "featureAnalysis"]
};


export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following URL for phishing potential: ${url}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a highly advanced AI-powered Phishing Detection System. Your task is to analyze a given URL and provide a detailed risk assessment. You must respond ONLY with a JSON object that strictly adheres to the provided schema. Do not include any introductory text, apologies, or explanations outside of the JSON structure. Analyze features like URL structure (length, special characters, subdomains), domain age, SSL/TLS certificate validity, keyword usage (e.g., 'login', 'secure'), and HTML content cues if possible. Base your confidence score on the combination of these factors.",
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    
    // Basic validation to ensure the response shape is correct
    if (!result.classification || !result.featureAnalysis) {
        throw new Error("Invalid response format from AI.");
    }

    return result;
  } catch (error) {
    console.error("Error analyzing URL with Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The service may be busy or the URL is invalid.");
  }
};
