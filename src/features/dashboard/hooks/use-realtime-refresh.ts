"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const WATCHED_TABLES = ["rsvps", "guestbook_messages"] as const;

/**
 * Assina em tempo real as interações de um casamento e revalida a rota
 * (Server Components) sempre que algo muda — o painel do anfitrião reage
 * instantaneamente a novas contribuições, reservas, presenças e recados.
 */
export function useRealtimeRefresh(weddingId: string) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`wedding:${weddingId}`);

    for (const table of WATCHED_TABLES) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `wedding_id=eq.${weddingId}`,
        },
        () => router.refresh(),
      );
    }

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [weddingId, router]);
}
