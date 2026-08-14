import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

/** Botão de envio com spinner e bloqueio automático durante o loading. */
export function SubmitButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
