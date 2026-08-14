import { z } from "zod";

/**
 * Validações de autenticação (compartilhadas entre client e server).
 * As Server Actions revalidam com estes mesmos schemas — nunca confie só no client.
 */
export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(80, "Nome muito longo"),
  email: z.email("Informe um e-mail válido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha é muito longa"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Informe um e-mail válido"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
