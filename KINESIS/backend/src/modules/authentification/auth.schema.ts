import { z } from "zod";

const passwordInput = z
  .string()
  .min(1, "Le mot de passe est obligatoire")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Le mot de passe ne peut pas dépasser 72 octets",
  );

export const loginSchema = z
  .object({
    identifier: z.string().trim().min(1).max(254),
    password: passwordInput,
  })
  .strict();

export const registerTravelerSchema = z
  .object({
    email: z.email().trim().toLowerCase(),
    phoneNumber: z.string().trim().min(6).max(32),
    password: z
      .string()
      .refine(
        (password) => Array.from(password).length >= 8,
        "Le mot de passe doit contenir au moins 8 caractères",
      )
      .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        "Le mot de passe ne peut pas dépasser 72 octets",
      ),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
  })
  .strict();

export const newPasswordSchema = z
  .string()
  .refine(
    (password) => Array.from(password).length >= 8,
    "Le mot de passe doit contenir au moins 8 caractères",
  )
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Le mot de passe ne peut pas dépasser 72 octets",
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterTravelerInput = z.infer<typeof registerTravelerSchema>;