import type { Metadata } from "next";

import { AccountForm } from "@/features/auth/components/account-form";
import {
  getCurrentProfile,
  getCurrentUser,
} from "@/features/auth/services/auth.service";

export const metadata: Metadata = { title: "Minha conta" };

export default async function ContaPage() {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Minha conta
      </h1>
      <p className="text-muted-foreground mt-1 mb-8">
        Gerencie suas informações pessoais.
      </p>
      <AccountForm
        initialName={profile?.full_name ?? ""}
        email={user?.email ?? ""}
      />
    </div>
  );
}
