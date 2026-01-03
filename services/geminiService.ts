
import { GoogleGenAI, Type } from "@google/genai";
import { Incident } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getIncidentResolutionSuggestion = async (incident: Incident): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this incident and suggest immediate remediation steps:
      Title: ${incident.title}
      Description: ${incident.description}
      Priority: ${incident.priority}
      Status: ${incident.status}`,
      config: {
        systemInstruction: "You are an expert site reliability engineer. Provide clear, concise, and professional technical resolution steps in markdown format.",
      },
    });
    return response.text || "No suggestion available at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI suggestion.";
  }
};

export const generateSummaryReport = async (incidents: Incident[]): Promise<string> => {
  try {
    const summaryData = incidents.map(i => ({
      title: i.title,
      priority: i.priority,
      status: i.status
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize these operational incidents and provide a status report: ${JSON.stringify(summaryData)}`,
      config: {
        systemInstruction: "Provide a high-level executive summary of recent system operations. Focus on trends and critical areas.",
      },
    });
    return response.text || "Summary report currently unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate report.";
  }
};
