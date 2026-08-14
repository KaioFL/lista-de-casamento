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
import { SubmitButton } from "@/components/shared/submit-button";
import { slugify } from "@/lib/slug";
import { siteConfig } from "@/config/site";

import { createWeddingAction } from "../actions/wedding.actions";
import {
  createWeddingSchema,
  type CreateWeddingInput,
} from "../schemas/wedding.schema";

export function CreateWeddingDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateWeddingInput>({
    resolver: zodResolver(createWeddingSchema),
    defaultValues: {
      partnerOneName: "",
      partnerTwoName: "",
      slug: "",
      eventDate: "",
      eventLocation: "",
    },
  });

  // Slug automático a partir dos nomes (até o usuário editar manualmente).
  function syncSlug(one: string, two: string) {
    if (slugEdited) return;
    const generated = slugify([one, two].filter(Boolean).join("-"));
    form.setValue("slug", generated, { shouldValidate: generated.length >= 3 });
  }

  function onSubmit(values: CreateWeddingInput) {
    startTransition(async () => {
      const result = await createWeddingAction(values);
      if (result.success) {
        toast.success("Casamento criado! Vamos montar a lista.");
        setOpen(false);
        form.reset();
        router.push(`/painel/${result.data.id}`);
        router.refresh();
      } else {
        if (result.fieldErrors?.slug) {
          form.setError("slug", { message: result.fieldErrors.slug[0] });
        }
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
            Novo casamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Criar casamento
          </DialogTitle>
          <DialogDescription>
            Comece com o essencial — você personaliza todo o resto depois.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="partnerOneName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ana"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          syncSlug(e.target.value, form.getValues("partnerTwoName"));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partnerTwoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="João"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          syncSlug(form.getValues("partnerOneName"), e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço da página</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-muted-foreground border-input bg-muted/50 rounded-l-lg border border-r-0 px-3 py-2 text-sm">
                        {siteConfig.name.toLowerCase()}.app/
                      </span>
                      <Input
                        className="rounded-l-none"
                        placeholder="ana-e-joao"
                        {...field}
                        onChange={(e) => {
                          setSlugEdited(true);
                          field.onChange(slugify(e.target.value));
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    É o link que você compartilha com os convidados.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data (opcional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo, SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <SubmitButton loading={isPending} loadingText="Criando…">
                Criar casamento
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
