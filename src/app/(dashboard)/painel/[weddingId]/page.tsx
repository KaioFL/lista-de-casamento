import Link from "next/link";
import {
  Gift,
  MessageCircleHeart,
  PartyPopper,
  Settings2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import {
  getWeddingById,
  getWeddingDashboardStats,
} from "@/features/weddings/services/wedding.queries";

export default async function WeddingOverviewPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const [wedding, stats] = await Promise.all([
    getWeddingById(weddingId),
    getWeddingDashboardStats(weddingId),
  ]);

  return (
    <div className="space-y-6">
      {!wedding?.is_published && (
        <div className="border-accent/60 bg-accent/20 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
          <div>
            <p className="font-medium">Seu convite ainda é um rascunho</p>
            <p className="text-muted-foreground text-sm">
              Publique para compartilhar o link com os convidados.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/painel/${weddingId}/configuracoes`}>
              Personalizar convite
            </Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Presença confirmada"
          value={stats?.rsvp_confirmed ?? 0}
          icon={PartyPopper}
          hint={`${stats?.guests_expected ?? 0} pessoas esperadas`}
        />
        <StatCard
          label="Convidados esperados"
          value={stats?.guests_expected ?? 0}
          icon={Users}
          hint="Incluindo acompanhantes"
        />
        <StatCard
          label="Sugestões de presente"
          value={stats?.gifts_total ?? 0}
          icon={Gift}
          hint="Na vitrine do convite"
        />
        <StatCard
          label="Recados a moderar"
          value={stats?.guestbook_pending ?? 0}
          icon={MessageCircleHeart}
          hint="Aguardando aprovação"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/painel/${weddingId}/configuracoes`}
          className="border-border hover:border-primary/40 group rounded-xl border p-5 transition-colors"
        >
          <Settings2 className="text-primary size-6" />
          <h3 className="font-heading mt-3 text-lg font-semibold">
            Personalizar o convite
          </h3>
          <p className="text-muted-foreground text-sm">
            Capa, cores, data, local e história do casal.
          </p>
        </Link>
        <Link
          href={`/painel/${weddingId}/convidados`}
          className="border-border hover:border-primary/40 group rounded-xl border p-5 transition-colors"
        >
          <Users className="text-primary size-6" />
          <h3 className="font-heading mt-3 text-lg font-semibold">
            Ver confirmações
          </h3>
          <p className="text-muted-foreground text-sm">
            Acompanhe quem confirmou presença no seu grande dia.
          </p>
        </Link>
      </div>
    </div>
  );
}
