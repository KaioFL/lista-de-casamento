"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { GiftCategory } from "@/types";

import {
  createCategoryAction,
  deleteCategoryAction,
} from "../actions/gift.actions";

export function CategoryManagerDialog({
  weddingId,
  categories,
}: {
  weddingId: string;
  categories: GiftCategory[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function add() {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await createCategoryAction(weddingId, { name, icon: "" });
      if (result.success) {
        setName("");
        router.refresh();
      } else toast.error(result.error);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteCategoryAction(id, weddingId);
      if (result.success) router.refresh();
      else toast.error(result.error);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tag className="size-4" />
          Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Categorias</DialogTitle>
          <DialogDescription>
            Organize os presentes em grupos (ex.: Cozinha, Quarto, Lua de mel).
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nova categoria"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button onClick={add} disabled={isPending || !name.trim()}>
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma categoria ainda.
            </p>
          ) : (
            categories.map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                className="gap-1 py-1 pr-1 pl-2.5"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  disabled={isPending}
                  className="hover:bg-foreground/10 ml-0.5 rounded-full p-0.5"
                  aria-label={`Remover ${c.name}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
