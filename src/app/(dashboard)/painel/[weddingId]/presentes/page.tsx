import { Gift } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { CategoryManagerDialog } from "@/features/gifts/components/category-manager-dialog";
import { GiftFormDialog } from "@/features/gifts/components/gift-form-dialog";
import { GiftManageCard } from "@/features/gifts/components/gift-manage-card";
import {
  getGiftCategories,
  getGiftsForWedding,
} from "@/features/gifts/services/gift.queries";

export default async function PresentesPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const [gifts, categories] = await Promise.all([
    getGiftsForWedding(weddingId),
    getGiftCategories(weddingId),
  ]);

  const totalItems = gifts.length;
  const reservedItems = gifts.filter(
    (g) =>
      g.status === "reserved" ||
      (g.reservations &&
        g.reservations.some((r) => r.status !== "cancelled")),
  ).length;
  const availableItems = totalItems - reservedItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-xl font-semibold">
              O que levar · Lista colaborativa
            </h2>
            {totalItems > 0 && (
              <span className="text-muted-foreground text-xs font-normal">
                ({reservedItems} escolhido{reservedItems === 1 ? "" : "s"} ·{" "}
                {availableItems} disponível{availableItems === 1 ? "" : "is"})
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Cadastre os itens que os convidados podem escolher levar para a festa
            (bebidas, comidas, sobremesas, etc.).
          </p>
        </div>
        <div className="flex gap-2">
          <CategoryManagerDialog weddingId={weddingId} categories={categories} />
          <GiftFormDialog weddingId={weddingId} categories={categories} />
        </div>
      </div>

      {gifts.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="Nenhum item cadastrado ainda"
          description="Adicione os itens, comidas ou bebidas que os convidados podem escolher levar para a comemoração. Eles aparecem no convite para os convidados escolherem."
          action={
            <GiftFormDialog weddingId={weddingId} categories={categories} />
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gifts.map((gift) => (
            <GiftManageCard
              key={gift.id}
              gift={gift}
              weddingId={weddingId}
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
}
