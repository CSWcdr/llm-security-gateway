import { z } from "zod";

export const registerSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters."
      )
      .max(
        100,
        "Name must be less than 100 characters."
      ),

    email: z
      .string()
      .trim()
      .email(
        "Invalid email address."
      )
      .transform(
        (email) =>
          email.toLowerCase()
      ),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters."
      )
      .max(
        128,
        "Password is too long."
      ),
  });


export const loginSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Invalid email address."
      )
      .transform(
        (email) =>
          email.toLowerCase()
      ),

    password: z
      .string()
      .min(
        1,
        "Password is required."
      ),
  });