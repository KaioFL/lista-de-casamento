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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">
            Lista de presentes
          </h2>
          <p className="text-muted-foreground text-sm">
            Sugestões que vocês gostariam de ganhar — só para mostrar aos
            convidados.
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
          title="Sua lista está vazia"
          description="Adicione as sugestões de presente que vocês gostariam de receber. Elas aparecem no convite, apenas para os convidados verem."
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
