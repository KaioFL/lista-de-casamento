import { z } from "zod";

const optionalUrl = z.url("URL inválida").optional().or(z.literal(""));

/**
 * Schema do formulário de presente (vitrine — apenas exibição, sem compra).
 * Input === output (sem coerce/default) para o zodResolver do react-hook-form.
 */
export const giftFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Informe o nome do presente")
    .max(120, "Nome muito longo"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  imageUrl: optionalUrl,
  externalUrl: optionalUrl,
  categoryId: z.string().uuid().optional().or(z.literal("")),
  isFeatured: z.boolean(),
});

export type GiftFormInput = z.infer<typeof giftFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome").max(60),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const itemReservationSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(100, "Nome muito longo"),
  guestEmail: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(500, "Mensagem muito longa")
    .optional()
    .or(z.literal("")),
});

export type ItemReservationInput = z.infer<typeof itemReservationSchema>;

