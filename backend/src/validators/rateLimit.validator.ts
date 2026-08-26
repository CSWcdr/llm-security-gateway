import { z } from "zod";

export const rateLimitParamsSchema =
  z.object({
    projectId: z
      .string()
      .uuid("Invalid project ID."),
  });

export const updateRateLimitSchema =
  z
    .object({
      enabled:
        z.boolean().optional(),

      requestsPerMinute:
        z
          .number()
          .int()
          .positive()
          .max(100000)
          .optional(),

      requestsPerHour:
        z
          .number()
          .int()
          .positive()
          .max(1000000)
          .optional(),

      requestsPerDay:
        z
          .number()
          .int()
          .positive()
          .max(10000000)
          .optional(),

      burstLimit:
        z
          .number()
          .int()
          .positive()
          .max(10000)
          .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one rate limit field must be provided.",
      }
    );