"use client";

import { useState, useTransition } from "react";
import { Check, HeartHandshake, Loader2, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  itemReservationSchema,
  type ItemReservationInput,
} from "@/features/gifts/schemas/gift.schema";
import { reserveGiftAction } from "@/features/gifts/actions/reservation.actions";

interface BringItemDialogProps {
  weddingId: string;
  giftId: string;
  itemTitle: string;
  trigger?: React.ReactNode;
}

export function BringItemDialog({
  weddingId,
  giftId,
  itemTitle,
  trigger,
}: BringItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ItemReservationInput>({
    resolver: zodResolver(itemReservationSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      message: "",
    },
  });

  function onSubmit(values: ItemReservationInput) {
    startTransition(async () => {
      const result = await reserveGiftAction(weddingId, giftId, values);
      if (result.success) {
        toast.success(`Prontinho! Você confirmou que vai levar "${itemTitle}".`, {
          description: "Os noivos foram informados com muito carinho!",
        });
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            size="sm"
            className="w-full cursor-pointer bg-[color:var(--wine)] text-white shadow-sm hover:opacity-90 text-xs px-2.5 h-8.5 sm:h-9"
          >
            <HeartHandshake className="mr-1.5 size-3.5 shrink-0" />
            Eu levo este item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md w-[calc(100vw-2rem)] sm:w-full p-5 sm:p-6">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-[color:var(--wine)]/10 text-[color:var(--wine)]">
            <ShoppingBag className="size-5" />
          </div>
          <DialogTitle className="text-center font-heading text-xl">
            Vou levar este item
          </DialogTitle>
          <DialogDescription className="text-center text-balance">
            Você está escolhendo levar{" "}
            <strong className="text-foreground font-semibold">
              "{itemTitle}"
            </strong>{" "}
            para a celebração.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mariana Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp ou E-mail (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: mariana@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recado aos noivos (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Ex: Pode deixar comigo, levo com muito carinho! ❤️"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[color:var(--wine)] text-white hover:opacity-90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 size-4" />
                    Confirmar que vou levar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
