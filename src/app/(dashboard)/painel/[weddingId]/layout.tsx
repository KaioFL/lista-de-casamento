import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RealtimeRefresher } from "@/features/dashboard/components/realtime-refresher";
import { PublishToggle } from "@/features/weddings/components/publish-toggle";
import { ShareWeddingDialog } from "@/features/weddings/components/share-wedding-dialog";
import { WeddingNav } from "@/features/weddings/components/wedding-nav";
import { getWeddingById } from "@/features/weddings/services/wedding.queries";

export default async function WeddingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const wedding = await getWeddingById(weddingId);
  if (!wedding) notFound();

  return (
    <div className="container-page py-8">
      <RealtimeRefresher weddingId={wedding.id} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/painel"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Meus casamentos
          </Link>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {wedding.partner_one_name} &amp; {wedding.partner_two_name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PublishToggle
            weddingId={wedding.id}
            published={wedding.is_published}
          />
          {wedding.is_published && (
            <>
              <ShareWeddingDialog
                slug={wedding.slug}
                coupleNames={`${wedding.partner_one_name} & ${wedding.partner_two_name}`}
              />
              <Button asChild variant="outline" size="sm">
                <Link href={`/${wedding.slug}`} target="_blank">
                  Ver página
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <WeddingNav weddingId={wedding.id} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
