import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GuestbookMessage } from "@/types";

/** Recados aprovados de um casamento (ordem cronológica inversa). */
export async function getApprovedGuestbook(
  weddingId: string,
): Promise<GuestbookMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guestbook_messages")
    .select("*")
    .eq("wedding_id", weddingId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(60);
  return data ?? [];
}
