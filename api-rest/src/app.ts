import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "./utils/logger.js";
import { db } from "../src/db/index.js"
import {sql} from "drizzle-orm";

export const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is running"
  });
});

app.get("/health/db", async function (_req, res, next) {
  try {
    await db.execute(sql`SELECT 1 `)
    res.status(200).json({
      success: true,
      message: "Database connection healthy",
    })
  } catch (error) {
    next(error);
  }
})