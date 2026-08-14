"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/format";

import { logoutAction } from "../actions/auth.actions";

interface UserMenuProps {
  name: string | null;
  email: string;
  avatarUrl?: string | null;
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? email} />}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getInitials(name ?? email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{name ?? "Minha conta"}</span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/painel">
            <LayoutDashboard className="size-4" />
            Meus casamentos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/conta">
            <Settings className="size-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault();
            startTransition(() => logoutAction());
          }}
        >
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
