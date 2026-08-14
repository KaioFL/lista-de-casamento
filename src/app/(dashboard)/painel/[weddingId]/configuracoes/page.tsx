import { notFound } from "next/navigation";

import { SettingsForm } from "@/features/weddings/components/settings-form";
import { getWeddingById } from "@/features/weddings/services/wedding.queries";

export default async function ConfiguracoesPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const wedding = await getWeddingById(weddingId);
  if (!wedding) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Configurações</h2>
        <p className="text-muted-foreground text-sm">
          Personalize a página pública do seu casamento.
        </p>
      </div>
      <SettingsForm wedding={wedding} />
    </div>
  );
}
