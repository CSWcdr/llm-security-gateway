import { z } from "zod";

export const analyticsParamsSchema =
  z.object({
    projectId: z
      .string()
      .uuid(
        "Invalid project ID."
      ),
  });

export const analyticsQuerySchema =
  z.object({
    days: z.coerce
      .number()
      .int()
      .min(1)
      .max(30)
      .default(7),
  });