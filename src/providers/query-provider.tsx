"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // No cliente reusa o singleton; no servidor cria um por request.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
