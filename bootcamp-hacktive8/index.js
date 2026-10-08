import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cosr from "cors";
import multer from "multer";

const app = express();

const upload = multer({
  limits: {
    fileSize: 3_000_000
  }
});

const PORT = 3000;

const ai = new GoogleGenAI()

const AI_MODEL = "gemini-3.1-flash-lite";

// inisialisai aplikasi
app.use(express.json())
app.use(cosr())

// inisialisai route & handler
app.get("/api/health", (req, res) => {
  res.send("Hello world")
})

// generate from text base
app.post("/api/generate-text", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "prompt is required"
    })
  }

  try {
    const response = await ai.interactions.create({
      model: AI_MODEL,
      input: prompt,
    });

    return res.status(200).json({
      success: true,
      message: response.output_text
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
});

// generate from image
app.post("/api/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "prompt is required"
    })
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "image file is required"
    })
  }

  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.interactions.create({
      model: AI_MODEL,
      input: [
        { type: "text", text: prompt },
        { type: "image", data: base64Image, mime_type: req.file.mimetype },
      ],
    });

    return res.status(200).json({
      success: true,
      message: response.output_text
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});

// generate from document
app.post("/api/generate-from-document", upload.single("document"), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString("base64");

  if (!req.file) {
    res.status(400).json({
      message: "document file is required"
    })
  }

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [{
        role: "user", parts: [
          { text: prompt ?? "Tolong ringkaskan dokumen berikut", type: "text" },
          { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
        ]
      }]
    });

    return res.status(200).json({
      success: true,
      result: response.text
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message })
  }
});

// generate from audio
app.post("/api/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString("base64");

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "audio file is required"
    });
  }

  if (!req.file.mimetype.startsWith("audio/")) {
    return res.status(400).json({
      success: false,
      message: "Invalid type file audio"
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt ?? "Desribe this audio", type: "text" },
            { inlineData: { data: base64Audio, mimeType: req.file.mimetype }}
          ]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: response.text
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Internal server error, ${e.message}`
    })
  }
});

// bungkus
app.listen(PORT, () => {
  console.log("Bungkus gan di", `http://localhost:${PORT}`)
})