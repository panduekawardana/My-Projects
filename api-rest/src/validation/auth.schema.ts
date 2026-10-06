import { z } from "zod";

/**
 * Schema validasi untuk registrasi user.
 * - password minimal 8 karakter
 * - email divalidasi formatnya
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name wajib diisi")
    .max(100, "Name maksimal 100 karakter"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi"),
});

/**
 * Type inference dari schema Zod
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
