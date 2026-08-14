"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

import {
  guestbookSchema,
  rsvpSchema,
  type GuestbookInput,
  type RsvpInput,
} from "../schemas/guest.schema";

const nz = (v?: string | null) => (v && v.trim() !== "" ? v.trim() : null);

export async function createRsvpAction(
  weddingId: string,
  input: RsvpInput,
): Promise<ActionResult> {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").insert({
    wedding_id: weddingId,
    guest_name: parsed.data.guestName,
    guest_email: nz(parsed.data.guestEmail),
    phone: nz(parsed.data.phone),
    status: parsed.data.status,
    companions: Number(parsed.data.companions),
    notes: nz(parsed.data.notes),
  });

  if (error) return { success: false, error: "Não foi possível confirmar sua presença." };

  revalidatePath(`/painel/${weddingId}/convidados`);
  return { success: true, data: undefined };
}

export async function createGuestbookMessageAction(
  weddingId: string,
  input: GuestbookInput,
): Promise<ActionResult> {
  const parsed = guestbookSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase.from("guestbook_messages").insert({
    wedding_id: weddingId,
    author_name: parsed.data.authorName,
    content: parsed.data.content,
  });

  if (error) return { success: false, error: "Não foi possível enviar o recado." };

  revalidatePath(`/painel/${weddingId}/recados`);
  return { success: true, data: undefined };
}
