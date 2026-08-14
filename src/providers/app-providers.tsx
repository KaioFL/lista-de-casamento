"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

/**
 * Composição única de todos os providers client-side da aplicação.
 * Ordem importa: tema → cache de dados → tooltips → conteúdo → toasts.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster
            richColors
            closeButton
            position="top-center"
            toastOptions={{ classNames: { toast: "font-sans" } }}
          />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
