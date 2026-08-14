import { z } from "zod";

const guestName = z
  .string()
  .trim()
  .min(1, "Informe seu nome")
  .max(80, "Nome muito longo");

const optionalEmail = z.email("E-mail inválido").optional().or(z.literal(""));

export const rsvpSchema = z.object({
  guestName,
  guestEmail: optionalEmail,
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  status: z.enum(["confirmed", "declined"]),
  companions: z.string().refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n <= 20;
  }, "Número inválido"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const guestbookSchema = z.object({
  authorName: guestName,
  content: z
    .string()
    .trim()
    .min(1, "Escreva uma mensagem")
    .max(2000, "Mensagem muito longa"),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type GuestbookInput = z.infer<typeof guestbookSchema>;
