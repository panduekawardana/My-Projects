import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

export class ApiChatRequestController {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });
    this.model = process.env.GOOGLE_AI_MODEL;
  }

  handleChat = async (req, res) => {
    const {prompt} = req.body;

    if (!Array.isArray(prompt) || prompt.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prompt must be a non-empty array!'
      });
    }

    try {
      const content = prompt.map(({role, text}) => ({
        role,
        parts: [{text}]
      }));

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: content,
        config: {
          temperature: 0.9,
          systemInstruction: process.env.SYSTEM_INSTRUCTION || undefined,
          thinkingConfig: {
            thinkingLevel: "HIGH",
          }
        }
      });

      return res.status(200).json({
        success: true,
        results: response.text,
      });

    } catch (err) {
      console.error(`[ChatController]`, err);
      return res.status(500).json({
        success: false,
        message: err.message,
      })
    }
  };
}