import { ChevronDown } from "lucide-react";

import type { Wedding } from "@/types";

import { Countdown } from "./countdown";

function formatFullDate(iso: string) {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" });
  const rest = d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return `${weekday}, ${rest}`;
}

export function PublicHero({ wedding }: { wedding: Wedding }) {
  const m1 = wedding.partner_one_name.charAt(0).toUpperCase();
  const m2 = wedding.partner_two_name.charAt(0).toUpperCase();

  return (
    <header className="relative isolate flex min-h-[82svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center text-white">
      {/* Fundo */}
      {wedding.cover_image_url ? (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wedding.cover_image_url}
            alt=""
            className="size-full origin-center animate-[ken-burns_20s_ease-out_both] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_45%,rgba(0,0,0,0.45))]" />
        </div>
      ) : (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(130% 130% at 50% 0%, color-mix(in oklch, ${wedding.primary_color} 78%, #000) 0%, color-mix(in oklch, ${wedding.primary_color} 32%, #000) 55%, #0a0708 100%)`,
          }}
        />
      )}

      {/* Moldura fina */}
      <div className="pointer-events-none absolute inset-3 -z-10 rounded-[2px] border border-white/15 sm:inset-5" />

      <p className="animate-[rise_0.9s_ease_0.1s_both] label-caps text-[0.65rem] text-white/70">
        {wedding.hero_headline || "Convidamos você para o nosso casamento"}
      </p>

      <div className="animate-[rise_0.9s_ease_0.25s_both] my-5 flex size-12 items-center justify-center rounded-full border border-white/40">
        <span className="font-heading text-sm tracking-[0.15em]">
          {m1}&nbsp;{m2}
        </span>
      </div>

      <h1 className="animate-[rise_1s_ease_0.4s_both] font-heading text-[clamp(2.5rem,8.5vw,5.25rem)] leading-[0.95] font-medium">
        <span className="block">{wedding.partner_one_name}</span>
        <span className="my-0.5 block text-[0.45em] font-light text-white/70 italic">
          &amp;
        </span>
        <span className="block">{wedding.partner_two_name}</span>
      </h1>

      {wedding.event_date && (
        <div className="animate-[rise_1s_ease_0.6s_both] mt-7 flex items-center gap-3 text-white/85">
          <span className="h-px w-6 bg-white/40 sm:w-10" />
          <span className="label-caps text-[0.65rem]">
            {formatFullDate(wedding.event_date)}
          </span>
          <span className="h-px w-6 bg-white/40 sm:w-10" />
        </div>
      )}

      {wedding.event_date && (
        <div className="animate-[rise_1s_ease_0.8s_both] mt-8 text-white">
          <Countdown date={wedding.event_date} />
        </div>
      )}

      <a
        href="#programa"
        aria-label="Ver detalhes"
        className="absolute bottom-6 animate-bounce opacity-60 transition-opacity hover:opacity-100"
      >
        <ChevronDown className="size-5" />
      </a>
    </header>
  );
}
