import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/features/auth/components/user-menu";

interface DashboardHeaderProps {
  name: string | null;
  email: string;
  avatarUrl?: string | null;
}

export function DashboardHeader({ name, email, avatarUrl }: DashboardHeaderProps) {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
        </div>
      </div>
    </header>
  );
}
