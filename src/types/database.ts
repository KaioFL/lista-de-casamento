import type { Database } from "@/lib/supabase/database.types";

/**
 * Helpers genéricos sobre o schema gerado pelo Supabase.
 * Toda a aplicação deriva seus tipos daqui — o banco é a fonte de verdade.
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type DbFunctions = Database["public"]["Functions"];
