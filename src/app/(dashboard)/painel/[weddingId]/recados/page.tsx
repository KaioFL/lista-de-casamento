import { MessageCircleHeart } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { GuestbookModeration } from "@/features/dashboard/components/guestbook-moderation";
import { getAllGuestbookMessages } from "@/features/dashboard/services/dashboard.queries";

export default async function RecadosPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;
  const messages = await getAllGuestbookMessages(weddingId);
  const pending = messages.filter((m) => !m.is_approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Recados</h2>
        <p className="text-muted-foreground text-sm">
          {pending > 0
            ? `${pending} recado(s) aguardando aprovação`
            : "Modere as mensagens deixadas pelos convidados."}
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={MessageCircleHeart}
          title="Nenhum recado ainda"
          description="As mensagens deixadas pelos convidados na página pública aparecerão aqui para você aprovar."
        />
      ) : (
        <GuestbookModeration messages={messages} weddingId={weddingId} />
      )}
    </div>
  );
}
