import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {ApiChatRequestController} from "./src/controllers/api-request-controller.js";

const app = express();

const handleChatController = new ApiChatRequestController()

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
})

app.get("/", function (req, res) {
  res.send("Hello world");
});

// API Chat
app.post("/api/chat", handleChatController.handleChat);
