import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}

/** Marca do produto: monograma de anéis entrelaçados + wordmark em serifa. */
export function Logo({ className, href = "/", showWordmark = true }: LogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="relative inline-flex size-7 items-center justify-center"
      >
        <svg viewBox="0 0 32 32" className="size-7" fill="none">
          <circle
            cx="12"
            cy="16"
            r="8"
            className="stroke-primary"
            strokeWidth="2.5"
          />
          <circle
            cx="20"
            cy="16"
            r="8"
            className="stroke-accent-foreground/70 transition-colors group-hover:stroke-primary"
            strokeWidth="2.5"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-heading text-xl font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={siteConfig.name}>
        {content}
      </Link>
    );
  }
  return content;
}
