import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger.js";

export const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is running"
  });
});