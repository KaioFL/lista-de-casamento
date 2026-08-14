"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateProfileAction } from "../actions/auth.actions";

export function AccountForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateProfileAction(name);
      if (result.success) {
        toast.success("Perfil atualizado!");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </div>
      <Button onClick={save} disabled={isPending || name.trim() === initialName}>
        {isPending ? "Salvando…" : "Salvar"}
      </Button>
    </div>
  );
}
