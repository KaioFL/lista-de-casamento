"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubmitButton } from "@/components/shared/submit-button";
import { ImageUploadField } from "@/features/storage/components/image-upload-field";
import type { Gift, GiftCategory } from "@/types";

import { createGiftAction, updateGiftAction } from "../actions/gift.actions";
import { giftFormSchema, type GiftFormInput } from "../schemas/gift.schema";

const NO_CATEGORY = "__none__";

interface GiftFormDialogProps {
  weddingId: string;
  categories: GiftCategory[];
  gift?: Gift;
  trigger?: React.ReactNode;
}

export function GiftFormDialog({
  weddingId,
  categories,
  gift,
  trigger,
}: GiftFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(gift);

  const form = useForm<GiftFormInput>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      title: gift?.title ?? "",
      description: gift?.description ?? "",
      imageUrl: gift?.image_url ?? "",
      externalUrl: gift?.external_url ?? "",
      categoryId: gift?.category_id ?? "",
      isFeatured: gift?.is_featured ?? false,
    },
  });

  function onSubmit(values: GiftFormInput) {
    startTransition(async () => {
      const result = isEdit
        ? await updateGiftAction(gift!.id, weddingId, values)
        : await createGiftAction(weddingId, values);

      if (result.success) {
        toast.success(isEdit ? "Item atualizado!" : "Item adicionado!");
        setOpen(false);
        if (!isEdit) form.reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            Adicionar item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {isEdit ? "Editar item" : "Novo item para levar"}
          </DialogTitle>
          <DialogDescription>
            Cadastre um item, bebida ou comida para os convidados escolherem levar
            para a celebração.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do item</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Fardo de Cerveja Heineken, Torta de Frango..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={field.value || NO_CATEGORY}
                        onValueChange={(v) =>
                          field.onChange(v === NO_CATEGORY ? "" : v)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sem categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_CATEGORY}>
                            Sem categoria
                          </SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Detalhes, cor, referência…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem do presente</FormLabel>
                      <FormControl>
                        <ImageUploadField
                          value={field.value}
                          onChange={field.onChange}
                          bucket="gift-images"
                          folder={weddingId}
                          aspect="aspect-video"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Onde encontrar (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um link de referência para os convidados, se quiser.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Destacar na lista</FormLabel>
                        <FormDescription>
                          Aparece em primeiro para os convidados.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="mt-4">
              <SubmitButton loading={isPending} loadingText="Salvando…">
                {isEdit ? "Salvar alterações" : "Adicionar presente"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
