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
import type { Gift, GiftCategory } from "@/types";

import { deleteGiftAction } from "../actions/gift.actions";
import { GiftFormDialog } from "./gift-form-dialog";

interface GiftManageCardProps {
  gift: Gift & { category: GiftCategory | null };
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

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGiftAction(gift.id, weddingId);
      if (result.success) {
        toast.success("Presente excluído.");
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
          <h3 className="truncate font-medium">{gift.title}</h3>
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
          {gift.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {gift.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive ml-auto"
                aria-label="Excluir presente"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir presente?</AlertDialogTitle>
                <AlertDialogDescription>
                  O presente “{gift.title}” será removido da lista.
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
