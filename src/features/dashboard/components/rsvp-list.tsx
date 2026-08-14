"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateShort } from "@/lib/format";
import type { Rsvp } from "@/types";

import { deleteRsvpAction } from "../actions/moderation.actions";

export function RsvpList({
  rsvps,
  weddingId,
}: {
  rsvps: Rsvp[];
  weddingId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteRsvpAction(id, weddingId);
      if (result.success) {
        toast.success("Removido.");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Convidado</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="text-center">Acompanhantes</TableHead>
            <TableHead>Resposta</TableHead>
            <TableHead>Data</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rsvps.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.guest_name}</div>
                {r.notes && (
                  <div className="text-muted-foreground line-clamp-1 max-w-[16rem] text-xs">
                    {r.notes}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {r.guest_email || r.phone || "—"}
              </TableCell>
              <TableCell className="text-center">{r.companions}</TableCell>
              <TableCell>
                {r.status === "confirmed" ? (
                  <Badge className="bg-success/15 text-success">Confirmado</Badge>
                ) : (
                  <Badge variant="secondary">Não vai</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateShort(r.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => remove(r.id)}
                  aria-label="Remover"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
