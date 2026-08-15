import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Gift, GiftCategory, GiftReservation } from "@/types";

import { BringItemDialog } from "./bring-item-dialog";
import { PixDialog } from "./pix-dialog";

type PublicGift = Gift & {
  category: GiftCategory | null;
  reservations?: GiftReservation[];
};

/**
 * Vitrine de item colaborativo ("O que levar"): cada item é apresentado
 * emoldurado com a opção do convidado confirmar "Vou levar este item".
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
  const isReserved =
    gift.status === "reserved" ||
    (gift.reservations &&
      gift.reservations.length > 0 &&
      gift.reservations.some((r) => r.status !== "cancelled"));

  return (
    <figure className="group flex flex-col justify-between">
      <div>
        {/* Moldura / passe-partout */}
        <div
          className={cn(
            "relative bg-card p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all duration-500",
            isReserved
              ? "opacity-80 grayscale-[30%]"
              : "group-hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] group-hover:ring-[color:var(--wine)]/40",
          )}
        >
          <div className="relative aspect-4/5 overflow-hidden">
            {gift.image_url ? (
              <Image
                src={gift.image_url}
                alt={gift.title}
                fill
                sizes="(max-width: 640px) 45vw, 280px"
                className={cn(
                  "object-cover transition-transform duration-[1.2s] ease-out",
                  !isReserved && "group-hover:scale-[1.06]",
                )}
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

            {/* Tag de reservado sobre a imagem */}
            {isReserved && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 font-heading text-xs font-semibold text-[color:var(--wine)] shadow-sm">
                  <Check className="size-3.5" />
                  Já escolhido
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
            <p className="text-muted-foreground mx-auto mt-1.5 max-w-[24ch] text-xs leading-relaxed text-balance">
              {gift.description}
            </p>
          )}
        </figcaption>
      </div>

      {/* Botões de Ação */}
      <div className="mt-4 flex flex-col items-center justify-center gap-2">
        {isReserved ? (
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs italic">
            <Check className="size-3.5 text-emerald-600" />
            Item já garantido
          </span>
        ) : (
          <BringItemDialog
            weddingId={gift.wedding_id}
            giftId={gift.id}
            itemTitle={gift.title}
          />
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {gift.external_url && (
            <a
              href={gift.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.7rem] font-medium [color:var(--wine)] transition-opacity hover:opacity-70"
            >
              Ver referência
              <ArrowUpRight className="size-3" />
            </a>
          )}
          {pixKey && (
            <PixDialog
              pixKey={pixKey}
              coupleNames={coupleNames}
              trigger={
                <button
                  type="button"
                  className="cursor-pointer text-[0.7rem] font-medium text-muted-foreground underline-offset-4 hover:underline"
                >
                  Ou presentear com PIX
                </button>
              }
            />
          )}
        </div>
      </div>
    </figure>
  );
}
