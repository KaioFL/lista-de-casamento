"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";

import { forgotPasswordAction } from "../actions/auth.actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await forgotPasswordAction(values);
      if (result.success) {
        setSent(true);
        toast.success("Link enviado! Confira seu e-mail.");
      } else {
        toast.error(result.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="border-border bg-muted/40 flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-6" />
        </div>
        <p className="font-medium">Verifique seu e-mail</p>
        <p className="text-muted-foreground text-sm">
          Se houver uma conta com esse endereço, enviamos um link para redefinir
          a senha.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
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
          className="h-11 w-full text-base"
        >
          Enviar link de recuperação
        </SubmitButton>
      </form>
    </Form>
  );
}
