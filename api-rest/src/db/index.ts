import { Pool } from "pg";
import { env } from "../config/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle(pool, {schema});