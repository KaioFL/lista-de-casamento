"use client";

import { useState } from "react";
import { Check, Copy, Download, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareWeddingDialogProps {
  slug: string;
  coupleNames: string;
  trigger?: React.ReactNode;
}

export function ShareWeddingDialog({
  slug,
  coupleNames,
  trigger,
}: ShareWeddingDialogProps) {
  const [copied, setCopied] = useState(false);

  // No client, pegamos o origin atual do browser (ex: https://meusite.com)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${origin}/${slug}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    publicUrl,
  )}`;

  const whatsappMessage = encodeURIComponent(
    `Olá! Convido você para o nosso casamento (${coupleNames}). Acesse o convite e confirme sua presença pelo link:\n${publicUrl}`,
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  function copyLink() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Link do convite copiado!");
    setTimeout(() => setCopied(false), 2500);
  }

  async function downloadQrCode() {
    try {
      const res = await fetch(qrCodeUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-casamento-${slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("QR Code baixado!");
    } catch {
      toast.error("Erro ao baixar o QR Code.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="size-4" />
            Compartilhar convite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <QrCode className="size-6" />
          </div>
          <DialogTitle className="font-heading text-xl">
            Compartilhar Convite
          </DialogTitle>
          <DialogDescription className="text-sm">
            Envie aos convidados ou baixe o QR Code para o seu convite impresso.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-5">
          {/* Link público com botão de cópia */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Link do convite
            </label>
            <div className="bg-muted/50 border-input flex items-center justify-between gap-2 rounded-xl border p-2.5">
              <span className="truncate font-mono text-xs text-foreground select-all">
                {publicUrl}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={copyLink}
                className="shrink-0 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Botão de envio rápido via WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#22bf5b] text-white flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-colors"
          >
            <Share2 className="size-4" />
            Enviar no WhatsApp
          </a>

          {/* Seção de QR Code */}
          <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-xl border p-4 text-center">
            <span className="text-muted-foreground mb-3 text-xs font-medium">
              QR Code para convite impresso
            </span>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code do convite"
                className="size-44 object-contain"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadQrCode}
              className="mt-3.5 gap-1.5"
            >
              <Download className="size-3.5" />
              Baixar imagem do QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
