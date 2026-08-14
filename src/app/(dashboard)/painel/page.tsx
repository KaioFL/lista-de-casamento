import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HeartHandshake } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { CreateWeddingDialog } from "@/features/weddings/components/create-wedding-dialog";
import { WeddingCard } from "@/features/weddings/components/wedding-card";
import { getUserWeddings } from "@/features/weddings/services/wedding.queries";

export const metadata: Metadata = { title: "Meus casamentos" };

export default async function PainelPage() {
  const weddings = await getUserWeddings();

  if (weddings.length === 1) {
    redirect(`/painel/${weddings[0].id}`);
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Meus casamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas listas de presentes e páginas de casamento.
          </p>
        </div>
        {weddings.length > 0 && <CreateWeddingDialog />}
      </div>

      {weddings.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="Comece o seu grande dia"
          description="Você ainda não criou nenhum casamento. Crie o primeiro e monte a lista de presentes em minutos."
          action={<CreateWeddingDialog />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {weddings.map((wedding) => (
            <WeddingCard key={wedding.id} wedding={wedding} />
          ))}
        </div>
      )}
    </div>
  );
}
