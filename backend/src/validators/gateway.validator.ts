import { z } from "zod";

export const gatewayScanSchema =
  z.object({
    prompt: z
      .string()
      .min(
        1,
        "Prompt is required."
      )
      .max(
        10000,
        "Prompt is too long."
      ),
  });