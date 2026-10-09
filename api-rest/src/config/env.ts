import "dotenv/config";
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
    
  DATABASE_URL: z.string().min(1, "DATABASE_URL harus dikonfigurasi"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET harus dikonfigurasi"),

  JWT_ACCESS_EXPIRES: z.string().default("15m")
});

export const env = envSchema.parse(process.env)
