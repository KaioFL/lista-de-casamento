"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageCircleHeart } from "lucide-react";

import { Card } from "@/components/ui/card";
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
import { SubmitButton } from "@/components/shared/submit-button";
import { EmptyState } from "@/components/shared/empty-state";
import type { GuestbookMessage } from "@/types";

import { createGuestbookMessageAction } from "../actions/guest.actions";
import { guestbookSchema, type GuestbookInput } from "../schemas/guest.schema";

interface GuestbookSectionProps {
  weddingId: string;
  messages: GuestbookMessage[];
}

export function GuestbookSection({ weddingId, messages }: GuestbookSectionProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<GuestbookInput>({
    resolver: zodResolver(guestbookSchema),
    defaultValues: { authorName: "", content: "" },
  });

  function onSubmit(values: GuestbookInput) {
    startTransition(async () => {
      const result = await createGuestbookMessageAction(weddingId, values);
      if (result.success) {
        toast.success("Recado enviado! Aparecerá após aprovação do casal.");
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Mural de citações */}
      {messages.length === 0 ? (
        <EmptyState
          icon={MessageCircleHeart}
          title="Seja o primeiro a deixar um recado"
          description="As mensagens aprovadas pelo casal aparecem aqui."
          className="bg-transparent"
        />
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {messages.map((m) => (
            <figure
              key={m.id}
              className="border-foreground/10 break-inside-avoid rounded-sm border-t pt-5"
            >
              <blockquote className="font-heading text-lg leading-relaxed italic text-pretty">
                “{m.content}”
              </blockquote>
              <figcaption className="label-caps mt-4 text-[0.65rem] opacity-60">
                {m.author_name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* Formulário */}
      <Card className="mx-auto mt-10 max-w-xl border-black/5 p-6 shadow-sm sm:p-8">
        <p className="label-caps text-center text-[0.65rem] [color:var(--wine)]">
          Escreva para os noivos
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Como assinar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Escreva seus votos de felicidade…"
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
              Enviar recado
            </SubmitButton>
          </form>
        </Form>
      </Card>
    </div>
  );
}
