import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Gift, GiftCategory } from "@/types";

export type GiftWithCategory = Gift & { category: GiftCategory | null };

/** Presentes de um casamento (visão do anfitrião), com categoria embutida. */
export async function getGiftsForWedding(
  weddingId: string,
): Promise<GiftWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gifts")
    .select("*, category:gift_categories(*)")
    .eq("wedding_id", weddingId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data ?? []) as GiftWithCategory[];
}

/** Categorias de presentes de um casamento. */
export async function getGiftCategories(
  weddingId: string,
): Promise<GiftCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gift_categories")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

/** Presentes públicos (vitrine): destacados primeiro. */
export async function getPublicGifts(
  weddingId: string,
): Promise<GiftWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gifts")
    .select("*, category:gift_categories(*)")
    .eq("wedding_id", weddingId)
    .neq("status", "archived")
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true });

  return (data ?? []) as GiftWithCategory[];
}
