import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateLong } from "@/lib/format";
import type { Wedding } from "@/types";

export function WeddingCard({ wedding }: { wedding: Wedding }) {
  return (
    <Link href={`/painel/${wedding.id}`} className="group block">
      <Card className="hover:border-primary/40 overflow-hidden p-0 transition-all hover:shadow-lg hover:shadow-primary/5">
        <div
          className="relative flex h-28 items-end p-4"
          style={{
            background: wedding.cover_image_url
              ? `center / cover no-repeat url(${wedding.cover_image_url})`
              : `linear-gradient(135deg, ${wedding.primary_color}, color-mix(in oklch, ${wedding.primary_color} 55%, #000))`,
          }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <Badge
            variant={wedding.is_published ? "default" : "secondary"}
            className="relative"
          >
            {wedding.is_published ? "Publicado" : "Rascunho"}
          </Badge>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg leading-tight font-semibold">
              {wedding.partner_one_name} & {wedding.partner_two_name}
            </h3>
            <ArrowUpRight className="text-muted-foreground group-hover:text-primary mt-0.5 size-4 shrink-0 transition-colors" />
          </div>

          <div className="text-muted-foreground space-y-1 text-sm">
            {wedding.event_date && (
              <p className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {formatDateLong(wedding.event_date)}
              </p>
            )}
            {wedding.event_location && (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {wedding.event_location}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
