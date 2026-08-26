import { z } from "zod";

export const createApiKeySchema =
  z.object({
    name: z
      .string()
      .min(
        2,
        "API key name must be at least 2 characters."
      )
      .max(
        100,
        "API key name must be less than 100 characters."
      ),
  });

export const projectApiKeyParamsSchema =
  z.object({
    projectId: z
      .string()
      .uuid(
        "Invalid project ID."
      ),
  });

export const apiKeyIdSchema =
  z.object({
    id: z
      .string()
      .uuid(
        "Invalid API key ID."
      ),
  });