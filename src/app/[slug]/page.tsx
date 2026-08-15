import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";
import { formatDateShort } from "@/lib/format";
import { getPublicGifts } from "@/features/gifts/services/gift.queries";
import { Grain } from "@/features/public-wedding/components/grain";
import { GuestbookSection } from "@/features/public-wedding/components/guestbook-section";
import { Ornament } from "@/features/public-wedding/components/ornament";
import { PixDialog } from "@/features/public-wedding/components/pix-dialog";
import { PublicGiftCard } from "@/features/public-wedding/components/public-gift-card";
import { PublicHero } from "@/features/public-wedding/components/public-hero";
import { RsvpForm } from "@/features/public-wedding/components/rsvp-form";
import { SectionHeading } from "@/features/public-wedding/components/section-heading";
import { getApprovedGuestbook } from "@/features/public-wedding/services/public.queries";
import { getPublishedWeddingBySlug } from "@/features/weddings/services/wedding.queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getPublishedWeddingBySlug(slug);
  if (!wedding) return { title: "Convite não encontrado" };
  const names = `${wedding.partner_one_name} & ${wedding.partner_two_name}`;
  return {
    title: names,
    description: wedding.welcome_message ?? `Convite de casamento de ${names}`,
    openGraph: {
      title: names,
      images: wedding.cover_image_url ? [wedding.cover_image_url] : undefined,
    },
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function PublicWeddingPage({ params }: PageProps) {
  const { slug } = await params;
  const wedding = await getPublishedWeddingBySlug(slug);
  if (!wedding) notFound();

  const [gifts, guestbook] = await Promise.all([
    getPublicGifts(wedding.id),
    getApprovedGuestbook(wedding.id),
  ]);

  const eventDate = wedding.event_date ? new Date(wedding.event_date) : null;
  const dateParts = eventDate
    ? {
        weekday: capitalize(
          eventDate.toLocaleDateString("pt-BR", { weekday: "long" }),
        ),
        day: eventDate.toLocaleDateString("pt-BR", { day: "2-digit" }),
        month: capitalize(
          eventDate.toLocaleDateString("pt-BR", { month: "long" }),
        ),
        year: eventDate.getFullYear(),
        time: eventDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    : null;
  const mapsHref = wedding.event_location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.event_location)}`
    : null;

  const wineStyle = { "--wine": wedding.primary_color } as CSSProperties;

  return (
    <div className="paper text-foreground relative min-h-svh" style={wineStyle}>
      <Grain />

      <PublicHero wedding={wedding} />

      <main className="relative">
        {/* I · Programa */}
        {(dateParts || wedding.event_location) && (
          <section id="programa" className="scroll-mt-4 py-14 sm:py-20">
            <div className="container-page max-w-3xl">
              <Reveal>
                <SectionHeading
                  eyebrow="O grande dia"
                  title="A celebração"
                />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-10 flex flex-col items-stretch justify-center gap-6 text-center sm:flex-row sm:gap-0">
                  {dateParts && (
                    <div className="flex flex-1 flex-col items-center justify-center px-6">
                      <span className="label-caps text-[0.6rem] opacity-60">
                        {dateParts.weekday}
                      </span>
                      <span className="font-heading mt-2 text-5xl leading-none font-medium">
                        {dateParts.day}
                      </span>
                      <span className="font-heading mt-1.5 text-lg italic">
                        {dateParts.month} · {dateParts.year}
                      </span>
                    </div>
                  )}

                  {dateParts && (
                    <div className="bg-foreground/10 hidden w-px sm:block" />
                  )}

                  {dateParts && (
                    <div className="flex flex-1 flex-col items-center justify-center px-6">
                      <span className="label-caps text-[0.6rem] opacity-60">
                        Horário
                      </span>
                      <span className="font-heading mt-2 text-3xl font-medium">
                        {dateParts.time}
                      </span>
                    </div>
                  )}

                  {wedding.event_location && (
                    <div className="bg-foreground/10 hidden w-px sm:block" />
                  )}

                  {wedding.event_location && (
                    <div className="flex flex-1 flex-col items-center justify-center px-6">
                      <span className="label-caps text-[0.6rem] opacity-60">
                        Local
                      </span>
                      <span className="font-heading mt-2 text-xl leading-tight font-medium text-balance">
                        {wedding.event_location}
                      </span>
                      {mapsHref && (
                        <a
                          href={mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1.5 text-sm [color:var(--wine)] hover:opacity-70"
                        >
                          <Navigation className="size-3.5" />
                          Como chegar
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* II · História */}
        {(wedding.welcome_message || wedding.story) && (
          <section className="relative py-14 sm:py-20">
            <div className="bg-foreground/[0.02] absolute inset-x-0 inset-y-8 -z-10" />
            <div className="container-page max-w-2xl text-center">
              <Reveal>
                <SectionHeading eyebrow="Nós dois" title="Como tudo começou" />
                {wedding.welcome_message && (
                  <p className="font-heading mt-8 text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.4] font-light text-balance italic">
                    “{wedding.welcome_message}”
                  </p>
                )}
                {wedding.story && (
                  <p className="text-muted-foreground mx-auto mt-6 max-w-prose leading-relaxed whitespace-pre-line">
                    {wedding.story}
                  </p>
                )}
              </Reveal>
            </div>
          </section>
        )}

        {/* III · Presentes */}
        {(gifts.length > 0 || wedding.pix_key) && (
          <section id="presentes" className="scroll-mt-4 py-14 sm:py-20">
            <div className="container-page">
              <Reveal>
                <SectionHeading
                  eyebrow="Com carinho"
                  title="Lista de presentes"
                />
                <p className="text-muted-foreground mx-auto mt-5 max-w-md text-center text-sm leading-relaxed">
                  Se desejarem nos presentear, reunimos aqui algumas ideias. Mas
                  saibam: a presença de vocês já é tudo o que pedimos.
                </p>
                {wedding.pix_key && (
                  <div className="mt-6 flex justify-center">
                    <PixDialog
                      pixKey={wedding.pix_key}
                      coupleNames={`${wedding.partner_one_name} & ${wedding.partner_two_name}`}
                    />
                  </div>
                )}
              </Reveal>
              {gifts.length > 0 && (
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                  {gifts.map((gift, i) => (
                    <Reveal key={gift.id} delay={(i % 4) * 0.06}>
                      <PublicGiftCard
                        gift={gift}
                        index={i}
                        pixKey={wedding.pix_key}
                        coupleNames={`${wedding.partner_one_name} & ${wedding.partner_two_name}`}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* IV · Presença */}
        <section
          id="presenca"
          className="bg-foreground/[0.03] scroll-mt-4 py-14 sm:py-20"
        >
          <div className="container-page max-w-xl">
            <Reveal>
              <SectionHeading eyebrow="R.S.V.P." title="Confirme sua presença" />
              <p className="text-muted-foreground mt-5 text-center text-sm">
                Ajude-nos a organizar tudo com carinho. Contamos com você!
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className="mt-8 border-black/5 p-6 shadow-sm sm:p-8">
                <RsvpForm weddingId={wedding.id} />
              </Card>
            </Reveal>
          </div>
        </section>

        {/* V · Recados */}
        <section id="recados" className="scroll-mt-4 py-14 sm:py-20">
          <div className="container-page">
            <Reveal>
              <SectionHeading eyebrow="Mural" title="Deixe seu carinho" />
            </Reveal>
            <div className="mt-10">
              <GuestbookSection weddingId={wedding.id} messages={guestbook} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-foreground/10 border-t py-12 text-center">
        <Ornament className="text-foreground" />
        <p className="font-heading mt-5 text-2xl">
          {wedding.partner_one_name} &amp; {wedding.partner_two_name}
        </p>
        {wedding.event_date && (
          <p className="label-caps mt-3 text-[0.65rem] opacity-55">
            {formatDateShort(wedding.event_date)}
          </p>
        )}
      </footer>

      {/* CTA persistente */}
      <a
        href="#presenca"
        className="bg-foreground text-background fixed right-5 bottom-5 z-40 hidden rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5 sm:inline-flex"
      >
        Confirmar presença
      </a>
    </div>
  );
}
