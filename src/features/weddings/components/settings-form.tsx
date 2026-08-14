"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
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
import { SubmitButton } from "@/components/shared/submit-button";
import { ImageUploadField } from "@/features/storage/components/image-upload-field";
import { slugify } from "@/lib/slug";
import type { Wedding } from "@/types";

import { updateWeddingAction } from "../actions/wedding.actions";
import {
  weddingSettingsSchema,
  type WeddingSettingsInput,
} from "../schemas/wedding.schema";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export function SettingsForm({ wedding }: { wedding: Wedding }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<WeddingSettingsInput>({
    resolver: zodResolver(weddingSettingsSchema),
    defaultValues: {
      partnerOneName: wedding.partner_one_name,
      partnerTwoName: wedding.partner_two_name,
      slug: wedding.slug,
      title: wedding.title ?? "",
      heroHeadline: wedding.hero_headline ?? "",
      eventDate: wedding.event_date ? wedding.event_date.slice(0, 10) : "",
      eventLocation: wedding.event_location ?? "",
      coverImageUrl: wedding.cover_image_url ?? "",
      welcomeMessage: wedding.welcome_message ?? "",
      story: wedding.story ?? "",
      pixKey: wedding.pix_key ?? "",
      primaryColor: wedding.primary_color,
    },
  });

  function onSubmit(values: WeddingSettingsInput) {
    startTransition(async () => {
      const result = await updateWeddingAction(wedding.id, values);
      if (result.success) {
        toast.success("Configurações salvas!");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SectionCard title="O casal">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="partnerOneName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primeiro nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Segundo nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(slugify(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Alterar o endereço muda o link público do casamento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        <SectionCard title="O evento">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
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
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade, estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="heroHeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frase de destaque</FormLabel>
                <FormControl>
                  <Input placeholder="Vamos nos casar!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        <SectionCard title="Aparência e história">
          <FormField
            control={form.control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem de capa</FormLabel>
                <FormControl>
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    bucket="wedding-covers"
                    folder={wedding.id}
                    aspect="aspect-[21/9]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor principal</FormLabel>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={field.value}
                    onChange={field.onChange}
                    className="border-input size-10 cursor-pointer rounded-lg border bg-transparent"
                    aria-label="Selecionar cor"
                  />
                  <FormControl>
                    <Input className="max-w-32 font-mono" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="welcomeMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem de boas-vindas</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="story"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nossa história</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Como tudo começou…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        <div className="flex justify-end">
          <SubmitButton loading={isPending} loadingText="Salvando…">
            Salvar configurações
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
