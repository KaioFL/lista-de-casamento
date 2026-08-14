"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { setWeddingPublishedAction } from "../actions/wedding.actions";

export function PublishToggle({
  weddingId,
  published,
}: {
  weddingId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onToggle(next: boolean) {
    startTransition(async () => {
      const result = await setWeddingPublishedAction(weddingId, next);
      if (result.success) {
        toast.success(next ? "Página publicada!" : "Página despublicada.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="publish"
        checked={published}
        disabled={isPending}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="publish" className="cursor-pointer text-sm">
        {published ? "Publicado" : "Rascunho"}
      </Label>
    </div>
  );
}
