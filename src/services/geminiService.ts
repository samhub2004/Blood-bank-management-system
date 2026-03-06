import { GoogleGenAI, Type } from "@google/genai";
import { BloodStock, BloodRequest, Donor, HistoricalUsage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const geminiService = {
  async forecastDemand(stock: BloodStock[], history: HistoricalUsage[]) {
    const prompt = `
      Analyze the following blood bank data and forecast potential shortages for the next 30 days.
      Current Stock: ${JSON.stringify(stock)}
      Historical Usage: ${JSON.stringify(history)}
      
      Consider seasonal trends (like holidays or weather) and rarity of blood types.
      Return a JSON object with:
      1. "forecast": An array of objects with { bloodType, predictedShortageRisk (0-100), reason }
      2. "recommendations": An array of strings for targeted blood drives.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bloodType: { type: Type.STRING },
                  predictedShortageRisk: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  },

  async chatWithAssistant(message: string, history: { role: 'user' | 'model', text: string }[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `
          You are VitalFlow AI, a helpful assistant for a Blood Bank Management System.
          You help donors with inquiries about eligibility, scheduling, and general blood donation facts.
          Eligibility rules:
          - Age: 18-65 years
          - Weight: At least 50kg
          - Health: Good general health, no recent tattoos/piercings (last 6 months), no active infections.
          - Interval: 3 months between donations.
          Be professional, empathetic, and concise.
        `,
      },
    });

    // Send history first if any
    // For simplicity in this demo, we just send the current message with context
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async optimizeRoute(origin: string, destination: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the fastest and safest route from ${origin} to ${destination} for blood transport. Consider hospitals and traffic patterns. Provide a list of waypoints.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  }
};
