"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/shared/submit-button";
import { cn } from "@/lib/utils";

import { createRsvpAction } from "../actions/guest.actions";
import { rsvpSchema, type RsvpInput } from "../schemas/guest.schema";

export function RsvpForm({ weddingId }: { weddingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const form = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      phone: "",
      status: "confirmed",
      companions: "0",
      notes: "",
    },
  });

  const status = useWatch({ control: form.control, name: "status" });

  function onSubmit(values: RsvpInput) {
    startTransition(async () => {
      const result = await createRsvpAction(weddingId, values);
      if (result.success) {
        setDone(true);
        toast.success("Resposta enviada. Obrigado!");
      } else {
        toast.error(result.error);
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
          <PartyPopper className="size-7" />
        </div>
        <p className="font-heading text-lg font-semibold">Resposta recebida!</p>
        <p className="text-muted-foreground max-w-xs text-sm">
          {status === "confirmed"
            ? "Que alegria contar com a sua presença. Até lá! 💛"
            : "Sentiremos sua falta, mas obrigado por avisar."}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Você vai comparecer?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: "confirmed", label: "Sim, eu vou! 🎉" },
                    { value: "declined", label: "Não poderei ir" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={`rsvp-${opt.value}`}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-center text-sm font-medium transition-colors",
                        field.value === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "hover:bg-muted",
                      )}
                    >
                      <RadioGroupItem
                        id={`rsvp-${opt.value}`}
                        value={opt.value}
                        className="sr-only"
                      />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acompanhantes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    disabled={status === "declined"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail (opcional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="voce@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Restrições alimentares, recado…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          loading={isPending}
          loadingText="Enviando…"
          className="w-full"
        >
          Enviar resposta
        </SubmitButton>
      </form>
    </Form>
  );
}
