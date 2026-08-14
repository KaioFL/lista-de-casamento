import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Estado vazio elegante e reutilizável para listas e coleções. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-muted/20 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="bg-primary/10 text-primary mb-4 flex size-14 items-center justify-center rounded-2xl">
          <Icon className="size-7" />
        </div>
      )}
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm text-sm text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
