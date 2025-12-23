
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoFrames = async (frames: {data: string; timestamp: number}[]): Promise<AnalysisResponse> => {
  // We use gemini-3-flash-preview for fast multimodal analysis
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this sequence of images from a surveillance camera.
    Your objective is to identify any 'two-wheeler' (motorcycle, scooter, bike) where the rider or passenger is disposing of waste (littering).
    
    For each incident found:
    1. Identify the 'timestamp' in seconds relative to the start of the video (e.g., "5.2").
    2. Provide a 'vehicleDescription' (color, type).
    3. Describe the 'actionDescription' (e.g., "threw a plastic bag").
    4. Extract the 'licensePlate' number from the vehicle if visible. Be as precise as possible.
    5. Assign a 'confidence' score between 0 and 1.

    If no incident is found, return an empty list of incidents.
  `;

  const imageParts = frames.map(frame => ({
    inlineData: {
      data: frame.data,
      mimeType: "image/jpeg"
    }
  }));

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { text: prompt },
        ...imageParts
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          incidents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                vehicleDescription: { type: Type.STRING },
                actionDescription: { type: Type.STRING },
                licensePlate: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ["timestamp", "vehicleDescription", "actionDescription", "licensePlate", "confidence"]
            }
          }
        },
        required: ["incidents"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Empty response from AI");
  }

  try {
    return JSON.parse(resultText) as AnalysisResponse;
  } catch (e) {
    console.error("Failed to parse AI response", resultText);
    throw new Error("Invalid response format from AI");
  }
};
