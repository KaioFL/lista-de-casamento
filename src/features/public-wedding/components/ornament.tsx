import { cn } from "@/lib/utils";

/** Divisor ornamental: linha fina com um losango central. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <span className="via-current h-px w-16 bg-gradient-to-r from-transparent to-transparent opacity-30" />
      <span className="text-primary/70 rotate-45 text-[0.6rem]">◆</span>
      <span className="via-current h-px w-16 bg-gradient-to-r from-transparent to-transparent opacity-30" />
    </div>
  );
}
