import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GuestbookMessage, Rsvp } from "@/types";

/** Lista de confirmações de presença. */
export async function getRsvps(weddingId: string): Promise<Rsvp[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Todos os recados (para moderação). */
export async function getAllGuestbookMessages(
  weddingId: string,
): Promise<GuestbookMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guestbook_messages")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
