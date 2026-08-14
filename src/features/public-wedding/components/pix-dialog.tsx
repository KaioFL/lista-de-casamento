"use client";

import { useState } from "react";
import { Check, Copy, QrCode } from "lucide-react";
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

interface PixDialogProps {
  pixKey: string;
  coupleNames?: string;
  trigger?: React.ReactNode;
}

export function PixDialog({ pixKey, coupleNames, trigger }: PixDialogProps) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada com sucesso!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="border-foreground/20 hover:bg-foreground/5 gap-2 rounded-full font-medium"
          >
            <QrCode className="size-4 [color:var(--wine)]" />
            Presentear via PIX
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[color:var(--wine)]/10 text-[color:var(--wine)]">
            <QrCode className="size-6" />
          </div>
          <DialogTitle className="font-heading text-xl">
            Presentear com PIX
          </DialogTitle>
          <DialogDescription className="text-sm">
            {coupleNames
              ? `Faça uma transferência diretamente para ${coupleNames} usando a chave PIX abaixo:`
              : "Faça uma transferência diretamente para os noivos usando a chave PIX abaixo:"}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-4">
          <div className="bg-muted/50 border-foreground/10 flex items-center justify-between gap-2 rounded-xl border p-3">
            <span className="font-mono text-sm font-medium tracking-tight break-all select-all">
              {pixKey}
            </span>
            <Button
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-xs leading-relaxed">
            Abra o app do seu banco, escolha a opção <strong>PIX</strong> e cole a chave acima. Todo valor recebido será recebido com muito carinho pelos noivos!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
