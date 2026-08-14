import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-0 p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="font-heading mt-3 text-2xl font-semibold tracking-tight">
        {value}
      </p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </Card>
  );
}
