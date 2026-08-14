import { Heart, Quote } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Painel decorativo (desktop) */}
      <aside className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.15] [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]"
        />
        <div className="relative">
          <Logo href="/" className="[&_span]:text-primary-foreground" />
        </div>

        <div className="relative max-w-md space-y-6">
          <Quote className="size-8 opacity-60" />
          <p className="font-heading text-2xl leading-snug font-medium text-balance">
            Cada presente é um gesto de carinho. Reunimos todos eles em um só
            lugar, do jeito de vocês.
          </p>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <Heart className="size-4" />
            <span>{siteConfig.name} · listas de casamento memoráveis</span>
          </div>
        </div>

        <div className="relative text-xs opacity-70">
          © {new Date().getFullYear()} {siteConfig.name}
        </div>
      </aside>

      {/* Formulário */}
      <main className="relative flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="lg:hidden">
            <Logo href="/" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              Precisa de ajuda?
            </span>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
