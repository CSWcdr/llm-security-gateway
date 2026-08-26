import { z } from "zod";

export const requestLogsParamsSchema =
  z.object({
    projectId: z
      .string()
      .uuid(
        "Invalid project ID."
      ),
  });

export const requestLogIdSchema =
  z.object({
    id: z
      .string()
      .uuid(
        "Invalid request log ID."
      ),
  });