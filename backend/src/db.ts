import dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables before accessing them
dotenv.config();

const requiredEnv = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD", "DB_PORT"] as const;

requiredEnv.forEach((key) => {
  const value = process.env[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing or invalid env var ${key}`);
  }
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
};