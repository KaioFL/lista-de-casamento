import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, Wedding } from "@/types";

/** Casamentos que o usuário logado possui (mais recentes primeiro). */
export const getUserWeddings = cache(async (): Promise<Wedding[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
});

/** Um casamento por id (RLS garante que só dono/colaborador acessa). */
export const getWeddingById = cache(
  async (id: string): Promise<Wedding | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("weddings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data;
  },
);

/** Página pública: casamento publicado por slug. */
export const getPublishedWeddingBySlug = cache(
  async (slug: string): Promise<Wedding | null> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("weddings")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data;
  },
);

/** Estatísticas do painel (via função SECURITY DEFINER no banco). */
export const getWeddingDashboardStats = cache(
  async (weddingId: string): Promise<DashboardStats | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_wedding_dashboard_stats", { wid: weddingId })
      .single();
    if (error) return null;
    return data as DashboardStats;
  },
);
