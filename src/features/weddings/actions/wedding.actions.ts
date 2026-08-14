"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult, TablesUpdate } from "@/types";

import {
  createWeddingSchema,
  updateWeddingSchema,
  type CreateWeddingInput,
  type UpdateWeddingInput,
} from "../schemas/wedding.schema";

/** "" → null (colunas opcionais). */
const nz = (v?: string | null) => (v && v.trim() !== "" ? v.trim() : null);

export async function createWeddingAction(
  input: CreateWeddingInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createWeddingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada. Entre novamente." };

  const { data, error } = await supabase
    .from("weddings")
    .insert({
      owner_id: user.id,
      partner_one_name: parsed.data.partnerOneName,
      partner_two_name: parsed.data.partnerTwoName,
      slug: parsed.data.slug,
      event_date: nz(parsed.data.eventDate),
      event_location: nz(parsed.data.eventLocation),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Este endereço (slug) já está em uso. Escolha outro.",
        fieldErrors: { slug: ["Slug já utilizado"] },
      };
    }
    return { success: false, error: "Não foi possível criar o casamento." };
  }

  revalidatePath("/painel");
  return { success: true, data: { id: data.id } };
}

export async function updateWeddingAction(
  id: string,
  input: UpdateWeddingInput,
): Promise<ActionResult> {
  const parsed = updateWeddingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const d = parsed.data;
  const patch: TablesUpdate<"weddings"> = {
    ...(d.partnerOneName !== undefined && { partner_one_name: d.partnerOneName }),
    ...(d.partnerTwoName !== undefined && { partner_two_name: d.partnerTwoName }),
    ...(d.slug !== undefined && { slug: d.slug }),
    ...(d.title !== undefined && { title: nz(d.title) }),
    ...(d.story !== undefined && { story: nz(d.story) }),
    ...(d.eventDate !== undefined && { event_date: nz(d.eventDate) }),
    ...(d.eventLocation !== undefined && { event_location: nz(d.eventLocation) }),
    ...(d.coverImageUrl !== undefined && { cover_image_url: nz(d.coverImageUrl) }),
    ...(d.welcomeMessage !== undefined && { welcome_message: nz(d.welcomeMessage) }),
    ...(d.heroHeadline !== undefined && { hero_headline: nz(d.heroHeadline) }),
    ...(d.pixKey !== undefined && { pix_key: nz(d.pixKey) }),
    ...(d.pixKeyType !== undefined && { pix_key_type: nz(d.pixKeyType) }),
    ...(d.primaryColor !== undefined && { primary_color: d.primaryColor }),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("weddings").update(patch).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Este endereço (slug) já está em uso.",
        fieldErrors: { slug: ["Slug já utilizado"] },
      };
    }
    return { success: false, error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/painel");
  revalidatePath(`/painel/${id}`);
  return { success: true, data: undefined };
}

export async function setWeddingPublishedAction(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("weddings")
    .update({ is_published: published })
    .eq("id", id);

  if (error) return { success: false, error: "Não foi possível atualizar." };

  revalidatePath("/painel");
  revalidatePath(`/painel/${id}`);
  return { success: true, data: undefined };
}

export async function deleteWeddingAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("weddings").delete().eq("id", id);
  if (error) return { success: false, error: "Não foi possível excluir." };

  revalidatePath("/painel");
  return { success: true, data: undefined };
}
