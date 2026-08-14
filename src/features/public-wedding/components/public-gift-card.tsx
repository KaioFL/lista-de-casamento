import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Gift, GiftCategory } from "@/types";

import { PixDialog } from "./pix-dialog";

type PublicGift = Gift & { category: GiftCategory | null };

/**
 * Vitrine: cada presente é apresentado como uma peça emoldurada (estilo galeria).
 * Sem compra pelo site — apenas exibição, elegante com ou sem foto.
 */
export function PublicGiftCard({
  gift,
  index,
  pixKey,
  coupleNames,
}: {
  gift: PublicGift;
  index: number;
  pixKey?: string | null;
  coupleNames?: string;
}) {
  const initial = gift.title.charAt(0).toUpperCase();

  return (
    <figure className="group">
      {/* Moldura / passe-partout */}
      <div className="relative bg-card p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all duration-500 group-hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] group-hover:ring-[color:var(--wine)]/40">
        <div className="relative aspect-4/5 overflow-hidden">
          {gift.image_url ? (
            <Image
              src={gift.image_url}
              alt={gift.title}
              fill
              sizes="(max-width: 640px) 45vw, 280px"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 0%, color-mix(in oklch, var(--wine) 12%, var(--card)), var(--card))",
              }}
            >
              <span className="font-heading text-6xl font-medium opacity-15 select-none [color:var(--wine)]">
                {initial}
              </span>
            </div>
          )}

          {/* Índice discreto */}
          <span className="absolute top-2.5 left-3 font-heading text-xs text-white/80 italic mix-blend-difference">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Legenda / plaquinha */}
      <figcaption className="mt-3 text-center">
        {gift.category && (
          <span className="label-caps text-[0.6rem] [color:var(--wine)] opacity-90">
            {gift.category.name}
          </span>
        )}
        <h3
          className={cn(
            "font-heading text-base leading-snug font-medium",
            gift.category && "mt-0.5",
          )}
        >
          {gift.title}
        </h3>
        {gift.description && (
          <p className="text-muted-foreground mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-balance">
            {gift.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {gift.external_url && (
            <a
              href={gift.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium [color:var(--wine)] transition-opacity hover:opacity-70"
            >
              Ver referência
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          {pixKey && (
            <PixDialog
              pixKey={pixKey}
              coupleNames={coupleNames}
              trigger={
                <button
                  type="button"
                  className="cursor-pointer text-xs font-semibold [color:var(--wine)] underline-offset-4 hover:underline"
                >
                  Presentear via PIX
                </button>
              }
            />
          )}
        </div>
      </figcaption>
    </figure>
  );
}
