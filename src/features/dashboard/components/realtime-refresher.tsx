"use client";

import { useRealtimeRefresh } from "../hooks/use-realtime-refresh";

/**
 * Componente-ponte: ativa as assinaturas realtime a partir de um Server
 * Component (o layout do painel). Não renderiza nada.
 */
export function RealtimeRefresher({ weddingId }: { weddingId: string }) {
  useRealtimeRefresh(weddingId);
  return null;
}
