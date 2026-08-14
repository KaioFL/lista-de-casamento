import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Recuperar acesso
        </h1>
        <p className="text-muted-foreground">
          Enviaremos um link para você criar uma nova senha.
        </p>
      </div>

      <ForgotPasswordForm />

      <Link
        href="/login"
        className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Voltar para o login
      </Link>
    </div>
  );
}
