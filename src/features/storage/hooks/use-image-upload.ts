"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "avatars" | "wedding-covers" | "gift-images";

/**
 * Faz upload de imagens para o Supabase Storage respeitando a convenção de
 * pastas ({owner}/arquivo) exigida pelas policies. Retorna a URL pública.
 */
export function useImageUpload(bucket: StorageBucket, folder: string) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10 MB.");
      return null;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error(`Falha no upload: ${error.message}`);
        return null;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}
