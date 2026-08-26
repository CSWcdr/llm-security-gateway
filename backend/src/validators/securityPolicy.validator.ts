import { z } from "zod";

export const securityPolicyParamsSchema =
  z.object({
    projectId: z
      .string()
      .uuid("Invalid project ID."),
  });

export const updateSecurityPolicySchema =
  z
    .object({
      promptInjectionEnabled:
        z.boolean().optional(),

      promptInjectionAction: z
        .enum([
          "BLOCK",
          "WARN",
          "MASK",
          "ALLOW",
        ])
        .optional(),

      piiDetectionEnabled:
        z.boolean().optional(),

      piiDetectionAction: z
        .enum([
          "BLOCK",
          "WARN",
          "MASK",
          "ALLOW",
        ])
        .optional(),

      secretDetectionEnabled:
        z.boolean().optional(),

      secretDetectionAction: z
        .enum([
          "BLOCK",
          "WARN",
          "MASK",
          "ALLOW",
        ])
        .optional(),

      outputScanningEnabled:
        z.boolean().optional(),

      outputScanningAction: z
        .enum([
          "BLOCK",
          "WARN",
          "MASK",
          "ALLOW",
        ])
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          "At least one security policy field must be provided.",
      }
    );