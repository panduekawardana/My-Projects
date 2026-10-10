import "dotenv/config";
import {GoogleGenAI} from "@google/genai";
import {searchProducts} from "../services/context-service.js";
import {buildSystemInstruction} from "../prompts/system-prompt.js";

const RETRYABLE_STATUS = new Set([404, 429, 500, 502, 503, 504]);
const RETRYABLE_HINTS = /(UNAVAILABLE|high demand|overloaded|RESOURCE_EXHAUSTED|try again)/i;

function extractStatus(err) {
  if (Number.isInteger(err?.status)) return err.status;
  if (Number.isInteger(err?.code)) return err.code;
  const match = String(err?.message || "").match(/"code"\s*:\s*(\d{3})/);
  return match ? Number(match[1]) : undefined;
}

function isRetryable(err) {
  const status = extractStatus(err);
  if (status === undefined) return true;
  return RETRYABLE_STATUS.has(status) || RETRYABLE_HINTS.test(err?.message || "");
}

function toUserMessage(err) {
  const status = extractStatus(err);
  if (status === 503 || RETRYABLE_HINTS.test(err?.message || "")) {
    return "Asisten AI sedang sibuk saat ini. Silakan coba lagi sebentar lagi.";
  }
  if (status === 429) {
    return "Terlalu banyak permintaan. Mohon tunggu beberapa saat lalu coba lagi.";
  }
  if (status === 404) {
    return "Model AI sedang tidak tersedia. Silakan coba lagi nanti.";
  }
  if (status === 400) {
    return "Permintaan tidak dapat diproses. Silakan coba lagi.";
  }
  return "Maaf, terjadi kendala saat menghubungi asisten AI. Silakan coba lagi.";
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiChatRequestController {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    const fallbacks = (process.env.GOOGLE_AI_MODEL_FALLBACKS || "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);

    const primary = process.env.GOOGLE_AI_MODEL;
    this.models = [...new Set([primary, ...fallbacks].filter(Boolean))];
    this.productLimit = Number(process.env.CONTEXT_PRODUCT_LIMIT) || 8;
    this.maxAttemptsPerModel = Number(process.env.AI_MAX_ATTEMPTS_PER_MODEL) || 2;
  }

  getLatestUserQuery(prompt) {
    for (let i = prompt.length - 1; i >= 0; i--) {
      if (prompt[i]?.role === "user") {
        return prompt[i].text || "";
      }
    }
    return "";
  }

  async generateWithFallback(contents, systemInstruction) {
    let lastError;

    for (const model of this.models) {
      for (let attempt = 1; attempt <= this.maxAttemptsPerModel; attempt++) {
        try {
          const response = await this.ai.models.generateContent({
            model,
            contents,
            config: {
              temperature: 0.9,
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: "HIGH",
              },
            },
          });

          if (model !== this.models[0] || attempt > 1) {
            console.warn(`[ChatController] Berhasil memakai model "${model}" (percobaan ${attempt}).`);
          }

          return response;
        } catch (err) {
          lastError = err;

          if (!isRetryable(err)) {
            throw err;
          }

          const status = extractStatus(err);
          console.warn(
            `[ChatController] Model "${model}" gagal (status ${status ?? "n/a"}), percobaan ${attempt}.`,
          );

          if (attempt < this.maxAttemptsPerModel) {
            await sleep(400 * attempt);
          }
        }
      }
    }

    throw lastError;
  }

  handleChat = async (req, res) => {
    const {prompt} = req.body;

    if (!Array.isArray(prompt) || prompt.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Prompt must be a non-empty array!",
      });
    }

    try {
      const content = prompt.map(({role, text}) => ({
        role,
        parts: [{text}],
      }));

      const query = this.getLatestUserQuery(prompt);
      const relevantProducts = searchProducts(query, this.productLimit);
      const systemInstruction =
        process.env.SYSTEM_INSTRUCTION || buildSystemInstruction(relevantProducts);

      const response = await this.generateWithFallback(content, systemInstruction);

      const products = relevantProducts.map((product) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        imageAlt: product.imageAlt || product.name,
      }));

      return res.status(200).json({
        success: true,
        results: response.text,
        products,
      });
    } catch (err) {
      console.error(`[ChatController] Semua model gagal:`, err?.message || err);
      return res.status(503).json({
        success: false,
        message: toUserMessage(err),
      });
    }
  };
}
