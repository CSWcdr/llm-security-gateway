import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters.")
    .max(100, "Project name must be less than 100 characters."),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters.")
    .optional(),

  environment: z
    .enum([
      "DEVELOPMENT",
      "PRODUCTION",
    ])
    .default("DEVELOPMENT"),

  status: z
    .enum([
      "ACTIVE",
      "PAUSED",
    ])
    .default("ACTIVE"),
});

export const updateProjectSchema =
  createProjectSchema
    .partial()
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one field must be provided.",
      }
    );

export const projectIdSchema = z.object({
  id: z.string().uuid(
    "Invalid project ID."
  ),
});