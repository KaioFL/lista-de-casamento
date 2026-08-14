import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 text-center">
      <Heart className="text-primary size-10" />
      <p className="text-muted-foreground mt-6 text-sm tracking-widest uppercase">
        Página não encontrada
      </p>
      <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight">
        Nada por aqui
      </h1>
      <p className="text-muted-foreground mt-3 max-w-sm">
        O link pode estar errado ou a página do casamento ainda não foi
        publicada.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </main>
  );
}
