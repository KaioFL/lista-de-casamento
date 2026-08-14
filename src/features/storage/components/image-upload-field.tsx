"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useImageUpload, type StorageBucket } from "../hooks/use-image-upload";

interface ImageUploadFieldProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket: StorageBucket;
  folder: string;
  className?: string;
  aspect?: string;
}

/** Campo de upload de imagem com preview, integrado ao Supabase Storage. */
export function ImageUploadField({
  value,
  onChange,
  bucket,
  folder,
  className,
  aspect = "aspect-video",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useImageUpload(bucket, folder);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
    e.target.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {value ? (
        <div
          className={cn(
            "bg-muted relative overflow-hidden rounded-xl border",
            aspect,
          )}
        >
          <Image src={value} alt="Prévia" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-background/80 hover:bg-background absolute top-2 right-2 flex size-7 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="Remover imagem"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/50 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors",
            aspect,
          )}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <ImagePlus className="size-6" />
          )}
          <span className="text-sm">
            {uploading ? "Enviando…" : "Enviar imagem"}
          </span>
        </button>
      )}

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Trocar imagem
        </Button>
      )}
    </div>
  );
}
