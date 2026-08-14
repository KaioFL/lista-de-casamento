"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/format";
import type { Rsvp } from "@/types";

interface ExportRsvpsButtonProps {
  rsvps: Rsvp[];
  filename?: string;
}

export function ExportRsvpsButton({
  rsvps,
  filename = "lista_de_convidados.csv",
}: ExportRsvpsButtonProps) {
  function exportCSV() {
    if (rsvps.length === 0) {
      toast.error("Nenhuma resposta para exportar.");
      return;
    }

    const headers = [
      "Nome",
      "Status",
      "Acompanhantes",
      "E-mail",
      "Telefone",
      "Observações",
      "Data da Resposta",
    ];

    const rows = rsvps.map((r) => [
      `"${(r.guest_name || "").replace(/"/g, '""')}"`,
      r.status === "confirmed" ? "Confirmado" : "Recusado",
      r.companions,
      `"${(r.guest_email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${formatDateShort(r.created_at)}"`,
    ]);

    // BOM para Excel reconhecer acentos em UTF-8 corretamente
    const csvContent =
      "\uFEFF" +
      [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Lista exportada em CSV!");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportCSV}
      disabled={rsvps.length === 0}
      className="gap-2"
    >
      <Download className="size-4" />
      Exportar CSV
    </Button>
  );
}
