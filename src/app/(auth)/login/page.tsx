import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Que bom te ver
        </h1>
        <p className="text-muted-foreground">
          Entre para gerenciar a sua lista de casamento.
        </p>
      </div>

      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>

      <p className="text-muted-foreground text-center text-sm">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-primary font-medium hover:underline"
        >
          Criar agora
        </Link>
      </p>
    </div>
  );
}
