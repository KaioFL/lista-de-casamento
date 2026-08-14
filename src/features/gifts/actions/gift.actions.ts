"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult, TablesInsert } from "@/types";

import {
  categoryFormSchema,
  giftFormSchema,
  type CategoryFormInput,
  type GiftFormInput,
} from "../schemas/gift.schema";

const nz = (v?: string | null) => (v && v.trim() !== "" ? v.trim() : null);

function giftPayload(weddingId: string, d: GiftFormInput) {
  return {
    wedding_id: weddingId,
    title: d.title,
    description: nz(d.description),
    image_url: nz(d.imageUrl),
    external_url: nz(d.externalUrl),
    category_id: nz(d.categoryId),
    is_featured: d.isFeatured,
  } satisfies TablesInsert<"gifts">;
}

export async function createGiftAction(
  weddingId: string,
  input: GiftFormInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = giftFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gifts")
    .insert(giftPayload(weddingId, parsed.data))
    .select("id")
    .single();

  if (error) return { success: false, error: "Não foi possível adicionar o presente." };

  revalidatePath(`/painel/${weddingId}/presentes`);
  return { success: true, data: { id: data.id } };
}

export async function updateGiftAction(
  giftId: string,
  weddingId: string,
  input: GiftFormInput,
): Promise<ActionResult> {
  const parsed = giftFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gifts")
    .update(giftPayload(weddingId, parsed.data))
    .eq("id", giftId);

  if (error) return { success: false, error: "Não foi possível salvar." };

  revalidatePath(`/painel/${weddingId}/presentes`);
  return { success: true, data: undefined };
}

export async function deleteGiftAction(
  giftId: string,
  weddingId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("gifts").delete().eq("id", giftId);

  if (error) return { success: false, error: "Não foi possível excluir." };

  revalidatePath(`/painel/${weddingId}/presentes`);
  return { success: true, data: undefined };
}

export async function createCategoryAction(
  weddingId: string,
  input: CategoryFormInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Nome inválido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gift_categories")
    .insert({
      wedding_id: weddingId,
      name: parsed.data.name,
      icon: nz(parsed.data.icon),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Já existe uma categoria com esse nome." };
    }
    return { success: false, error: "Não foi possível criar a categoria." };
  }

  revalidatePath(`/painel/${weddingId}/presentes`);
  return { success: true, data: { id: data.id } };
}

export async function deleteCategoryAction(
  categoryId: string,
  weddingId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gift_categories")
    .delete()
    .eq("id", categoryId);

  if (error) return { success: false, error: "Não foi possível excluir." };

  revalidatePath(`/painel/${weddingId}/presentes`);
  return { success: true, data: undefined };
}
