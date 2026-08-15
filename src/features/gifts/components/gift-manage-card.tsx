"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ExternalLink, Gift as GiftIcon, Pencil, Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Gift, GiftCategory, GiftReservation } from "@/types";

import { deleteGiftAction } from "../actions/gift.actions";
import { cancelReservationAction } from "../actions/reservation.actions";
import { GiftFormDialog } from "./gift-form-dialog";

interface GiftManageCardProps {
  gift: Gift & {
    category: GiftCategory | null;
    reservations?: GiftReservation[];
  };
  weddingId: string;
  categories: GiftCategory[];
}

export function GiftManageCard({
  gift,
  weddingId,
  categories,
}: GiftManageCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeReservation = gift.reservations?.find(
    (r) => r.status !== "cancelled",
  );
  const isReserved = gift.status === "reserved" || !!activeReservation;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGiftAction(gift.id, weddingId);
      if (result.success) {
        toast.success("Item excluído.");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function handleRelease() {
    startTransition(async () => {
      const result = await cancelReservationAction(
        weddingId,
        gift.id,
        activeReservation?.id,
      );
      if (result.success) {
        toast.success("Item liberado para outros convidados!");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <Card className="flex flex-row gap-0 overflow-hidden p-0">
      <div className="bg-muted relative w-24 shrink-0 sm:w-28">
        {gift.image_url ? (
          <Image
            src={gift.image_url}
            alt={gift.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground/40 flex h-full items-center justify-center">
            <GiftIcon className="size-8" />
          </div>
        )}
        {gift.is_featured && (
          <span className="bg-accent text-accent-foreground absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full">
            <Star className="size-3.5 fill-current" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate font-medium">{gift.title}</h3>
            {isReserved ? (
              <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-600/20 text-[11px]">
                ✓ Escolhido
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-[11px]">
                Disponível
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {gift.category && (
              <Badge variant="secondary" className="text-[11px]">
                {gift.category.name}
              </Badge>
            )}
            {gift.external_url && (
              <a
                href={gift.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs transition-colors"
              >
                <ExternalLink className="size-3" />
                referência
              </a>
            )}
          </div>

          {activeReservation && (
            <div className="rounded-md border border-emerald-600/20 bg-emerald-50/50 p-2 text-xs text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200">
              <p className="font-semibold">
                👤 Levado por: {activeReservation.guest_name}
              </p>
              {activeReservation.guest_email && (
                <p className="text-muted-foreground text-[11px]">
                  Contato: {activeReservation.guest_email}
                </p>
              )}
              {activeReservation.message && (
                <p className="mt-0.5 italic text-[11px]">
                  “{activeReservation.message}”
                </p>
              )}
            </div>
          )}

          {gift.description && !activeReservation && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {gift.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <GiftFormDialog
            weddingId={weddingId}
            categories={categories}
            gift={gift}
            trigger={
              <Button variant="outline" size="sm">
                <Pencil className="size-3.5" />
                Editar
              </Button>
            }
          />

          {isReserved && (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleRelease}
              className="text-xs text-amber-700 hover:bg-amber-50 dark:text-amber-300"
            >
              Liberar item
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive ml-auto"
                aria-label="Excluir item"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir item?</AlertDialogTitle>
                <AlertDialogDescription>
                  O item “{gift.title}” será removido da lista.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={handleDelete}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
