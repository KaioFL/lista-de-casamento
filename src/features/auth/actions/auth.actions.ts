"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  type LoginInput,
  type SignupInput,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";

/** Traduz mensagens de erro do Supabase Auth para pt-BR. */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha incorretos.",
    "Email not confirmed": "Confirme seu e-mail antes de entrar.",
    "User already registered": "Este e-mail já está cadastrado.",
    "Password should be at least 6 characters":
      "A senha deve ter pelo menos 6 caracteres.",
    "Signup requires a valid password": "Informe uma senha válida.",
    "Email rate limit exceeded":
      "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "User not found": "Usuário não encontrado.",
  };
  return map[message] ?? message ?? "Não foi possível concluir. Tente novamente.";
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function signupAction(input: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }

  // Sessão já criada (confirmação de e-mail desativada) → segue para o painel.
  if (data.session) {
    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  }

  // Confirmação de e-mail necessária.
  return {
    success: false,
    error: "Enviamos um link de confirmação para o seu e-mail.",
  };
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "E-mail inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }
  return { success: true, data: undefined };
}

export async function updateProfileAction(
  fullName: string,
): Promise<ActionResult> {
  const name = fullName.trim();
  if (name.length < 2) {
    return { success: false, error: "Informe seu nome." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: name })
    .eq("id", user.id);

  if (error) return { success: false, error: "Não foi possível salvar." };

  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function logoutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
