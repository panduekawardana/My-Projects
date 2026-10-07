import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express from "express";
import cosr from "cors";
import multer from "multer";

const app = express();

const upload = multer({
  limits: {
    fileSize: 1_000_000
  }
});

const PORT = 3000;

const ai = new GoogleGenAI()

const AI_MODEL = "gemini-3.1-flash-lite";

// inisialisai aplikasi
app.use(upload.single("file"))// multer upload single file
app.use(express.json())
app.use(cosr())

// inisialisai route & handler
app.get("/api/health", (req, res) => {
  res.send("Hello world")
})

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

app.post("/api/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "prompt is required"
    })
  }

  try {
    const response = await ai.interactions.create({
      model: AI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, MimeType: req.file.mimetype } },
      ]
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

// bungkus
app.listen(PORT, () => {
  console.log("Bungkus gan di", `http://localhost:${PORT}`)
})