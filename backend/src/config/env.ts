import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce
    .number()
    .default(8000),

  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),

  FRONTEND_URL: z
    .string()
    .default(
      "http://localhost:5173"
    ),

  DATABASE_URL: z
    .string()
    .min(
      1,
      "DATABASE_URL is required"
    ),

  DIRECT_URL: z
    .string()
    .min(
      1,
      "DIRECT_URL is required"
    ),

  REDIS_URL: z
    .string()
    .default(
      "redis://127.0.0.1:6379"
    ),

  GROQ_API_KEY: z
    .string()
    .min(
      1,
      "GROQ_API_KEY is required"
    ),

  GROQ_MODEL: z
    .string()
    .default(
      "llama-3.1-8b-instant"
    ),
});

const parsedEnv =
  envSchema.safeParse(
    process.env
  );

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:",
    parsedEnv.error.flatten()
  );

  process.exit(1);
}

export const env =
  parsedEnv.data;