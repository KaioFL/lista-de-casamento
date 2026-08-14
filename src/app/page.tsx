import Link from "next/link";
import { ArrowRight, Gift, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden">
      {/* Fundo decorativo suave */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--accent)_55%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[38rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      <section className="container-page flex flex-col items-center py-24 text-center">
        <span className="animate-[fade-in_0.6s_ease_forwards] inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
          <Heart className="size-3.5 text-primary" />
          {siteConfig.tagline}
        </span>

        <h1 className="mt-8 max-w-3xl font-heading text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl">
          A lista de casamento que os seus convidados vão{" "}
          <span className="text-primary italic">amar</span> presentear
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-6 text-base">
            <Link href="/cadastro">
              Criar minha lista
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 px-6 text-base"
          >
            <Link href="/login">
              <Gift className="size-4" />
              Já tenho uma conta
            </Link>
          </Button>
        </div>

        <p className="mt-16 text-xs tracking-wider text-muted-foreground/70 uppercase">
          Enlace · Convite de Casamento Elegante
        </p>
      </section>
    </main>
  );
}
