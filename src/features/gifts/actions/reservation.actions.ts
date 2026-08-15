"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/types";

import {
  itemReservationSchema,
  type ItemReservationInput,
} from "../schemas/gift.schema";

const nz = (v?: string | null) => (v && v.trim() !== "" ? v.trim() : null);

/**
 * Convidado reserva um item para levar no casamento.
 */
export async function reserveGiftAction(
  weddingId: string,
  giftId: string,
  input: ItemReservationInput,
): Promise<ActionResult> {
  const parsed = itemReservationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Por favor, preencha os dados corretamente.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Verifica se o item ainda está disponível
  const { data: gift, error: giftError } = await supabase
    .from("gifts")
    .select("id, status, title")
    .eq("id", giftId)
    .eq("wedding_id", weddingId)
    .single();

  if (giftError || !gift) {
    return { success: false, error: "Item não encontrado." };
  }

  if (gift.status === "reserved") {
    return {
      success: false,
      error: "Este item acabou de ser escolhido por outro convidado.",
    };
  }

  // Tenta usar o client admin se disponível (para garantir inserção e atualização atômica de status)
  const adminClient = createAdminClient();
  const db = adminClient ?? supabase;

  // 1. Registra a reserva
  const { error: resError } = await db.from("gift_reservations").insert({
    wedding_id: weddingId,
    gift_id: giftId,
    guest_name: parsed.data.guestName,
    guest_email: nz(parsed.data.guestEmail),
    message: nz(parsed.data.message),
    quantity: 1,
    status: "confirmed",
  });

  if (resError) {
    return {
      success: false,
      error: "Não foi possível registrar sua escolha. Tente novamente.",
    };
  }

  // 2. Atualiza o status do item para reservado
  await db.from("gifts").update({ status: "reserved" }).eq("id", giftId);

  revalidatePath(`/painel/${weddingId}/presentes`);
  revalidatePath("/", "layout");

  return { success: true, data: undefined };
}

/**
 * O anfitrião libera o item no painel caso o convidado desista ou troque.
 */
export async function cancelReservationAction(
  weddingId: string,
  giftId: string,
  reservationId?: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const db = adminClient ?? supabase;

  // 1. Remove ou cancela as reservas ativas deste item
  if (reservationId) {
    await db.from("gift_reservations").delete().eq("id", reservationId);
  } else {
    await db
      .from("gift_reservations")
      .delete()
      .eq("gift_id", giftId)
      .eq("wedding_id", weddingId);
  }

  // 2. Retorna o item para disponível
  const { error } = await db
    .from("gifts")
    .update({ status: "available" })
    .eq("id", giftId)
    .eq("wedding_id", weddingId);

  if (error) {
    return { success: false, error: "Não foi possível liberar o item." };
  }

  revalidatePath(`/painel/${weddingId}/presentes`);
  revalidatePath("/", "layout");

  return { success: true, data: undefined };
}
