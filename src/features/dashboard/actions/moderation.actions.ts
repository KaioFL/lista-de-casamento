"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

export async function setGuestbookApprovalAction(
  id: string,
  weddingId: string,
  approved: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("guestbook_messages")
    .update({ is_approved: approved })
    .eq("id", id);
  if (error) return { success: false, error: "Não foi possível atualizar." };
  revalidatePath(`/painel/${weddingId}/recados`);
  return { success: true, data: undefined };
}

export async function deleteGuestbookMessageAction(
  id: string,
  weddingId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("guestbook_messages")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: "Não foi possível excluir." };
  revalidatePath(`/painel/${weddingId}/recados`);
  return { success: true, data: undefined };
}

export async function deleteRsvpAction(
  id: string,
  weddingId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").delete().eq("id", id);
  if (error) return { success: false, error: "Não foi possível excluir." };
  revalidatePath(`/painel/${weddingId}/convidados`);
  return { success: true, data: undefined };
}
