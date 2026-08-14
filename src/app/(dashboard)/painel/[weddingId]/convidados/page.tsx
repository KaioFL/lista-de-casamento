import { PartyPopper, Users, UserX } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ExportRsvpsButton } from "@/features/dashboard/components/export-rsvps-button";
import { RsvpList } from "@/features/dashboard/components/rsvp-list";
import { getRsvps } from "@/features/dashboard/services/dashboard.queries";

export default async function ConvidadosPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const rsvps = await getRsvps(weddingId);

  const confirmed = rsvps.filter((r) => r.status === "confirmed");
  const declined = rsvps.filter((r) => r.status === "declined");
  const expected = confirmed.reduce((sum, r) => sum + 1 + r.companions, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-semibold">Convidados</h2>
          <p className="text-muted-foreground text-sm">
            Confirmações de presença recebidas pela página pública.
          </p>
        </div>
        <ExportRsvpsButton rsvps={rsvps} />
      </div>

      {rsvps.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhuma resposta ainda"
          description="As confirmações de presença dos convidados aparecerão aqui."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Total esperado"
              value={expected}
              icon={PartyPopper}
              hint="Convidados + acompanhantes"
            />
            <StatCard
              label="Confirmaram"
              value={confirmed.length}
              icon={Users}
            />
            <StatCard
              label="Não poderão ir"
              value={declined.length}
              icon={UserX}
            />
          </div>
          <RsvpList rsvps={rsvps} weddingId={weddingId} />
        </>
      )}
    </div>
  );
}
