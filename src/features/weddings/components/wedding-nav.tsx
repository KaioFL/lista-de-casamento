"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gift,
  LayoutGrid,
  MessageCircleHeart,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "", label: "Visão geral", icon: LayoutGrid, exact: true },
  { href: "/presentes", label: "O que levar", icon: Gift },
  { href: "/convidados", label: "Convidados", icon: Users },
  { href: "/recados", label: "Recados", icon: MessageCircleHeart },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function WeddingNav({ weddingId }: { weddingId: string }) {
  const pathname = usePathname();
  const base = `/painel/${weddingId}`;

  return (
    <nav className="scrollbar-none flex gap-1 overflow-x-auto lg:flex-col">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const full = `${base}${href}`;
        const active = exact ? pathname === full : pathname.startsWith(full);
        return (
          <Link
            key={href}
            href={full}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
