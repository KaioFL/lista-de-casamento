import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  getCurrentProfile,
  getCurrentUser,
} from "@/features/auth/services/auth.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-svh flex-col">
      <DashboardHeader
        name={profile?.full_name ?? null}
        email={user.email ?? ""}
        avatarUrl={profile?.avatar_url}
      />
      <div className="flex-1">{children}</div>
    </div>
  );
}
