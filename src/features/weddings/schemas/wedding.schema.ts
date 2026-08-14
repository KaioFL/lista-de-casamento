import { z } from "zod";

const slugRegex = /^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/;
const hexColor = /^#[0-9a-fA-F]{6}$/;

/** Campos comuns editáveis de um casamento. */
export const weddingFieldsSchema = z.object({
  partnerOneName: z
    .string()
    .trim()
    .min(1, "Informe o nome")
    .max(60, "Nome muito longo"),
  partnerTwoName: z
    .string()
    .trim()
    .min(1, "Informe o nome")
    .max(60, "Nome muito longo"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Mínimo de 3 caracteres")
    .max(60, "Máximo de 60 caracteres")
    .regex(slugRegex, "Use apenas letras, números e hífens"),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  story: z.string().trim().max(5000).optional().or(z.literal("")),
  eventDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Data inválida"),
  eventLocation: z.string().trim().max(160).optional().or(z.literal("")),
  coverImageUrl: z.url("URL inválida").optional().or(z.literal("")),
  welcomeMessage: z.string().trim().max(2000).optional().or(z.literal("")),
  heroHeadline: z.string().trim().max(160).optional().or(z.literal("")),
  pixKey: z.string().trim().max(160).optional().or(z.literal("")),
  pixKeyType: z.string().trim().max(30).optional().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(hexColor, "Cor inválida")
    .default("#7a1f2b"),
});

/** Criação exige apenas o essencial. */
export const createWeddingSchema = weddingFieldsSchema.pick({
  partnerOneName: true,
  partnerTwoName: true,
  slug: true,
  eventDate: true,
  eventLocation: true,
});

/** Atualização: todos os campos, parciais. */
export const updateWeddingSchema = weddingFieldsSchema.partial();

/**
 * Schema do formulário de configurações (input === output, sem defaults/coerce)
 * para compatibilidade com o zodResolver do react-hook-form.
 */
export const weddingSettingsSchema = z.object({
  partnerOneName: z.string().trim().min(1, "Informe o nome").max(60),
  partnerTwoName: z.string().trim().min(1, "Informe o nome").max(60),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Mínimo de 3 caracteres")
    .max(60)
    .regex(slugRegex, "Use apenas letras, números e hífens"),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  heroHeadline: z.string().trim().max(160).optional().or(z.literal("")),
  eventDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Data inválida"),
  eventLocation: z.string().trim().max(160).optional().or(z.literal("")),
  coverImageUrl: z.url("URL inválida").optional().or(z.literal("")),
  welcomeMessage: z.string().trim().max(2000).optional().or(z.literal("")),
  story: z.string().trim().max(5000).optional().or(z.literal("")),
  pixKey: z.string().trim().max(160).optional().or(z.literal("")),
  primaryColor: z.string().regex(hexColor, "Cor inválida"),
});

export type WeddingSettingsInput = z.infer<typeof weddingSettingsSchema>;

export type WeddingFields = z.infer<typeof weddingFieldsSchema>;
export type CreateWeddingInput = z.infer<typeof createWeddingSchema>;
export type UpdateWeddingInput = z.infer<typeof updateWeddingSchema>;
