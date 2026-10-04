import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "product-management-api"
  },
  redact: {
    paths: [
      "password",
      "passwordHash",
      "token",
      "authorization",
      "req.headers.authorization",
    ],
    censor: "[REDACTED]"
  },
});