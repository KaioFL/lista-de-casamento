import Link from "next/link";
import type { Metadata } from "next";

import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Comece a sua lista
        </h1>
        <p className="text-muted-foreground">
          Crie sua conta gratuita e monte a lista de presentes em minutos.
        </p>
      </div>

      <SignupForm />

      <p className="text-muted-foreground text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
