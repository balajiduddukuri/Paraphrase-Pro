import { GoogleGenAI, Type } from "@google/genai";
import { ParaphraseOption, EmailDraft, ChatMessage } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateParaphrasedOptions = async (originalMessage: string): Promise<ParaphraseOption[]> => {
  const ai = getAIClient();

  const prompt = `
    Paraphrase the following message into 7 variations suitable for software-industry communication.
    The output must strictly be a JSON array.
    
    Message to paraphrase: "${originalMessage}"
    
    Ensure the tones vary:
    1. Professional
    2. Diplomatic
    3. Direct/Concise
    4. Persuasive
    5. Casual/Friendly
    6. Social Media (LinkedIn/Twitter) - include appropriate emojis and hashtags.
    7. Motivational/Inspiring - uplifting and encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tone: {
                type: Type.STRING,
                description: "The tone of the paraphrased message (e.g. Professional, Social Media)"
              },
              message: {
                type: Type.STRING,
                description: "The actual paraphrased text content"
              }
            },
            required: ["tone", "message"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(text) as ParaphraseOption[];

  } catch (error) {
    console.error("Gemini API Error (Paraphrase):", error);
    throw error;
  }
};

export const generateEmailDraft = async (message: string, tone: string): Promise<EmailDraft> => {
  const ai = getAIClient();

  const prompt = `
    Draft a professional email for a software industry context based on the following key message.
    
    Key Message: "${message}"
    Tone: ${tone}
    
    The email should have a clear subject line and a structured body. 
    Use placeholders like [Name] or [Date] where appropriate.
    Output must be a JSON object with 'subject' and 'body'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "The email subject line"
            },
            body: {
              type: Type.STRING,
              description: "The email body text"
            }
          },
          required: ["subject", "body"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(text) as EmailDraft;

  } catch (error) {
    console.error("Gemini API Error (Email):", error);
    throw error;
  }
};

export const askGemini = async (currentMessage: string, history: ChatMessage[] = []): Promise<string> => {
  const ai = getAIClient();

  // Convert ChatMessage[] to the format expected by the SDK for history
  // The SDK expects: { role: 'user' | 'model', parts: [{ text: string }] }
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: formattedHistory,
      config: {
        systemInstruction: "You are a helpful, expert software industry consultant. You provide concise, accurate, and professional advice about software development, team management, and technical communication."
      }
    });

    const response = await chat.sendMessage({ message: currentMessage });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error (Ask):", error);
    throw error;
  }
};
