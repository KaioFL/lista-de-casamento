"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, EyeOff, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateShort, getInitials } from "@/lib/format";
import type { GuestbookMessage } from "@/types";

import {
  deleteGuestbookMessageAction,
  setGuestbookApprovalAction,
} from "../actions/moderation.actions";

export function GuestbookModeration({
  messages,
  weddingId,
}: {
  messages: GuestbookMessage[];
  weddingId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function approve(id: string, approved: boolean) {
    startTransition(async () => {
      const result = await setGuestbookApprovalAction(id, weddingId, approved);
      if (result.success) {
        toast.success(approved ? "Recado publicado." : "Recado ocultado.");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteGuestbookMessageAction(id, weddingId);
      if (result.success) {
        toast.success("Recado excluído.");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {messages.map((m) => (
        <Card key={m.id} className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(m.author_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{m.author_name}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDateShort(m.created_at)}
                </p>
              </div>
            </div>
            {m.is_approved ? (
              <Badge className="bg-success/15 text-success">Publicado</Badge>
            ) : (
              <Badge variant="secondary">Pendente</Badge>
            )}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-pretty">{m.content}</p>

          <div className="mt-4 flex items-center gap-1">
            {m.is_approved ? (
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() => approve(m.id, false)}
              >
                <EyeOff className="size-3.5" />
                Ocultar
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() => approve(m.id, true)}
                className="text-success"
              >
                <Check className="size-3.5" />
                Publicar
              </Button>
            )}
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => remove(m.id)}
              aria-label="Excluir"
              className="text-muted-foreground hover:text-destructive ml-auto"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
